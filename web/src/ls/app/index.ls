data = [
  ["", "John", "Joe", "David", "Mary"],
  ["Sakura", 90, 60, 80, 70],
  ["Sasuke", 80, 50, 70, 60],
  ["Naruto", 70, 40, 60, 50],
  ["Kakasi", 60, '', 50, 40],
  ["Itachi", 50, 20, '', 30],
]
sample = [["","宜靜","技安","阿福","大雄","聰明","世修","叮噹"],["林崔馬克","95","87","78","50","73","85","80"],["亞洲模擬人權法院","80","75","76","58","80","75","40"],["實價登錄 2.0 & 臺灣公寓大廈資料庫","95","83","80","59","72","85","80"],["回音森林","83","78","76","73","80","80","48"],["好新聞連播網","83","78","76","85","86","75","72"],["反制中共網軍入侵中文維基百科","70","83","78","5","76","85","80"],["BBC 拍攝","70","81","78","3","82","75","56"],["Cofacts 真的假的","73","81","82","40","20","80","64"],["2020投票指南","72","88","72","4","87","75","80"],["誠徵一日資料申請小幫手 ^^","84","90","86","74","86","85","48"],["Rentea 設計給租屋者的開源找屋工具","81","78","72","60","72","80","40"],["立志收羅全球知識，機器看得懂的維基百科--Wikidata","72","78","70","76","71","85","48"],["全民一起參與2020 總統候選人事實查核","85","87","70","6","78","80","80"],["g0v 社群治理討論 ","73","81","74","2","72","85","48"],["違章工廠舉報系統","80","79","68","72","75","80","48"],["NT01 地球上的夢幻逸品線上型錄","74","83","76","10","77","85","48"],["台灣開源義肢計劃","72","81","78","1","78","75","72"],[" 選舉/金流百科","95","79","66","70","89","75","80"],["資料申請小幫手","70","79","64","3","73","75","40"],["農業災損幾多錢","70","85","78","30","87","75","72"],["大河小溪全民齊督工","90","81","80","61","76","80","48"],["開源找屋工具","87","89","88","80","91","75","48"]]

local = {}

versusRenderer = (instance,td,row,col,prop,value,cellProperties) ->
  judges = local.judges or []
  Handsontable.renderers.TextRenderer.apply @, arguments
  if row + 1 == col => return {}
  td.classList.remove \win, \lose, \tie
  if value > judges.length / 2 => td.classList.add \win
  else if value < judges.length / 2 => td.classList.add \lose
  else => td.classList.add \tie
Handsontable.renderers.registerRenderer('versusRenderer', versusRenderer)

hot = new Handsontable(document.querySelector('#grid .inner'), {
  data: data,
  rowHeaders: true,
  colHeaders: true,
  filters: true,
  dropdownMenu: true
  afterChange: onchange
  rowHeights: 35
  colWidths: 80
  modifyColWidth: (w, col) -> if col == 0 => return 300
  stretchH: \all
})

Handsontable.hooks.add \beforePaste, (->clear!), hot
Handsontable.hooks.add \afterPaste, (->update!), hot
detailtable = new Handsontable(document.querySelector('#detail-grid .inner'), {
  rowHeaders: true,
  colHeaders: true,
  filters: true,
  dropdownMenu: true
  rowHeights: 30
  colWidths: 30
  cells: (r, c) -> return { renderer: \versusRenderer, readOnly: true }
  modifyColWidth: (w, col) -> if col == 0 => return 300
  stretchH: \all
})

count = {row: hot.countRows!, col: hot.countCols!}

clear = ->
  data.splice 0
  data.push ['']
  hot.updateSettings data: data, cells: (r, c) -> return {readOnly: false}
  detailtable.updateSettings data: [['']]

update = ->
  count <<< {row: hot.countRows!, col: hot.countCols!}
  votes = JSON.parse(JSON.stringify(data))
  local.judges = judges = votes.0.slice 1
  {rank, detail} = schulze.from-array votes, {}

  hot.setDataAtCell 0, count.col, 'Rank'
  hot.updateSettings cells: (r, c) -> if c == count.col => return {readOnly: true} else return {}
  for i from 0 til rank.length =>
    cand = rank[i]
    hot.setDataAtCell (cand.idx + 1), (count.col), cand.rank

  detailtable.loadData detail
  width = (count.row - 1) * 30 + 120 >? 800
  if width < window.innerWidth * 0.75 => width = window.innerWidth * 0.75
  else if width > window.innerWidth => width = window.innerWidth
  document.querySelector '#detail-grid' .style.width = "#{width}px"
  detailtable.updateSettings width: width

update!
onchange = -> update!

resize = ->
  [col, row] = Array.from(document.querySelectorAll(\input)).map(->+it.value)
  if !isNaN(row) and row > 1 =>
    if row < count.row => for r from count.row - 1 to row by -1 => hot.alter("remove_row", r)
    if row > count.row => for r from count.row til row => hot.alter("insert_row",r)
    count.row = row
  if !isNaN(col) and col > 1 =>
    if col < count.col => for r from count.col - 1 to col by -1 => hot.alter("remove_col", r)
    if col > count.col => for r from count.col til col => hot.alter("insert_col",r)
    count.col = col
  hot.updateSettings cells: (r, c) ->
    return if r < count.row and c < count.col => {readOnly: false} else {readOnly: true}

document.querySelector '.btn[data-action=clear]' .addEventListener \click, -> clear!
document.querySelector '.btn[data-action=sample]' .addEventListener \click, ->
  clear!
  data := JSON.parse(JSON.stringify(sample))
  hot.updateSettings data: data
  update!
