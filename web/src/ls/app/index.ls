sch = new schulze!
local = {}

data = [
  ["", "John", "Joe", "David", "Mary"],
  ["Project 1", 90, 60, 80, 70],
  ["Project 2", 80, 50, 70, 60],
  ["Project 3", 70, 40, 60, 50],
  ["Project 4", 60, '', 50, 40],
  ["Project 5", 50, 20, '', 30],
]
sample = [["","宜靜","技安","阿福","大雄","聰明","世修","叮噹"],["林崔馬克","95","87","78","50","73","85","80"],["亞洲模擬人權法院","80","75","76","58","80","75","40"],["實價登錄 2.0 & 臺灣公寓大廈資料庫","95","83","80","59","72","85","80"],["回音森林","83","78","76","73","80","80","48"],["好新聞連播網","83","78","76","85","86","75","72"],["反制中共網軍入侵中文維基百科","70","83","78","5","76","85","80"],["BBC 拍攝","70","81","78","3","82","75","56"],["Cofacts 真的假的","73","81","82","40","20","80","64"],["2020投票指南","72","88","72","4","87","75","80"],["誠徵一日資料申請小幫手 ^^","84","90","86","74","86","85","48"],["Rentea 設計給租屋者的開源找屋工具","81","78","72","60","72","80","40"],["立志收羅全球知識，機器看得懂的維基百科--Wikidata","72","78","70","76","71","85","48"],["全民一起參與2020 總統候選人事實查核","85","87","70","6","78","80","80"],["g0v 社群治理討論 ","73","81","74","2","72","85","48"],["違章工廠舉報系統","80","79","68","72","75","80","48"],["NT01 地球上的夢幻逸品線上型錄","74","83","76","10","77","85","48"],["台灣開源義肢計劃","72","81","78","1","78","75","72"],[" 選舉/金流百科","95","79","66","70","89","75","80"],["資料申請小幫手","70","79","64","3","73","75","40"],["農業災損幾多錢","70","85","78","30","87","75","72"],["大河小溪全民齊督工","90","81","80","61","76","80","48"],["開源找屋工具","87","89","88","80","91","75","48"]]

blank = (v) -> !("#{if v? => v else ''}").trim!

# sheet grows its backing array as we scroll into empty cells, so what `sheet.data()`
# returns is neither rectangular nor free of trailing blanks. square it up before use.
normalize = (d) ->
  rows = [((d or [])[i] or []).slice! for i from 0 til (d or []).length]
  while rows.length and rows[rows.length - 1].every(blank) => rows.pop!
  cols = 0
  for r in rows => if r.length > cols => cols = r.length
  while cols > 0 and rows.every((r) -> blank r[cols - 1]) => cols--
  rows.map (r) -> [(if r[i]? => r[i] else '') for i from 0 til cols]

# the rank column is written by us at the right end of the sheet. drop it before feeding
# the grid back to schulze, so recomputing never counts our own output as a ballot.
strip-rank = (d) ->
  if !d.length => return d
  idx = d.0.indexOf \Rank
  if idx < 0 => return d
  d.map (r) -> r.filter (v, i) -> i != idx

# only the Reset button wipes what was typed in. an unusable grid clears the result,
# never the input - the user is most likely still halfway through entering it.
clear-result = ->
  local.rank-col = null
  detail.data [['']]

clear = ->
  local := {}
  grid.data [['']]
  detail.data [['']]

update = ->
  raw = normalize grid.data!
  votes = strip-rank raw
  # a usable grid needs a header row/col plus at least one candidate and one judge
  if votes.length < 2 or votes.0.length < 2 =>
    clear-result!
    # a `Rank` column left over from a previous run means nothing now - drop it
    if raw.length and raw.0.indexOf(\Rank) >= 0 => grid.data votes
    return
  sch.from-array JSON.parse(JSON.stringify votes), {is-row-based: false, show-warning: false}
    .then ({candidates, pair-preference-matrix}) ->
      local.rank-col = rc = votes.0.length
      d = votes.map -> it.slice!
      d.0[rc] = \Rank
      candidates.map (c) -> d[c.idx + 1][rc] = c.rank
      grid.data d

      # byRank rows already carry rank and name; prepend a header row of ranks so a cell
      # can be read as `rank of row` versus `rank of col`.
      local.detail = [['', ''] ++ pair-preference-matrix.by-rank.map(->it.0.rank)] ++
        pair-preference-matrix.by-rank.map -> [it.0.rank, it.0.name] ++ it.slice 1
      detail.data local.detail

grid = new sheet do
  root: '#grid .inner'
  data: data
  # the data carries its own header row and name column, so the A/B/C - 1/2/3 gutters
  # would only repeat what is already on screen.
  idx: {row: false, col: false}
  frozen: {row: 1, col: 1}
  size: {col: ['16em']}
  class: {col: ['name']}
  scrollbar: true
  cellcfg: ({row, col, type}) ->
    if type == \readonly => return local.rank-col? and col == local.rank-col
    if type == \class => return if local.rank-col? and col == local.rank-col => \rank else ''
    return null

detail = new sheet do
  root: '#detail-grid .inner'
  editing: false
  idx: {row: false, col: false}
  frozen: {row: 1, col: 2}
  size: {col: ['4em', '16em']}
  class: {col: ['', 'name']}
  scrollbar: true
  cellcfg: ({row, col, type}) ->
    if type == \readonly => return true
    if type != \class => return null
    d = local.detail
    # row r is candidate r - 1, col c is candidate c - 2. the cell facing it across the
    # diagonal is therefore [c - 1][r + 1] - skip the diagonal itself.
    if !d or row < 1 or col < 2 or col == row + 1 => return ''
    v = (d[row] or [])[col]
    o = (d[col - 1] or [])[row + 1]
    if !(v?) or !(o?) => return ''
    if v > o => \win else if v < o => \lose else \tie

grid.on \change, -> update!
update!

document.querySelector '.btn[data-action=clear]' .addEventListener \click, -> clear!
document.querySelector '.btn[data-action=sample]' .addEventListener \click, ->
  clear!
  grid.data JSON.parse(JSON.stringify sample)
  update!
