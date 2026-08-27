sch = new schulze!
local = {}

# scores chosen so the default view already shows what makes Schulze different: rank 3
# beats rank 1 head to head yet still sits below it, reached through a chain. two cells
# are left unscored, which is the other thing worth showing off the shelf.
data = [
  ["", "John", "Joe", "David", "Mary", "Alex"],
  ["Project 1", 60, 80, 90, 60, 20],
  ["Project 2", 90, 70, 20, 20, 20],
  ["Project 3", 80, 60, 20, 30, 80],
  ["Project 4", '', 90, 50, 50, 20],
  ["Project 5", 70, 20, '', 80, 60],
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

# candidate names come from the grid, so everything user typed goes through here
# before it reaches innerHTML.
esc = (v) ->
  "#{if v? => v else ''}"
    .replace /&/g, '&amp;'
    .replace /</g, '&lt;'
    .replace />/g, '&gt;'
    .replace /"/g, '&quot;'

# one strongest path, drawn as nodes joined by the head to head result of each hop.
# a hop matching the overall strength is a weakest link - it is what the whole path is
# worth. several hops can be tied at it, and marking only one of them would be arbitrary.
chain-html = (hops, strength) ->
  if !(hops or []).length => return ''
  node = (i) -> "<span class=\"node\">#{esc sch.candidates[i].name}</span>"
  weakest = (h) -> if h.win == strength.0 and h.lose == strength.1 => ' weakest' else ''
  (
    [node hops.0.from] ++ hops.map (h) ->
      "<span class=\"link#{weakest h}\">#{h.win}:#{h.lose}</span>" + node(h.to)
  ).join ''

render-explain = ->
  node = document.querySelector \#explain
  if !(local.explain-idx?) or !local.order or local.order.indexOf(local.explain-idx) < 0 =>
    node.innerHTML = ''
    return
  e = sch.explain local.explain-idx
  html = ["""<div class="ex-head"><b>#{esc e.candidate.name}</b> <span class="ex-rank">rank #{e.candidate.rank} of #{sch.C}</span></div>"""]

  if !e.blocked-by.length =>
    html.push """<p class="ex-sub">nothing beats it - it wins or ties against every other project.</p>"""
  else
    html.push """<p class="ex-sub">beaten by #{e.blocked-by.length} project(s). each row below is one strongest path. the highlighted hops are its weakest links - that is what the whole path is worth.</p>"""
    for b in e.blocked-by
      html.push """<div class="ex-block">"""
      html.push """<div class="ex-block-head"><b class="ex-link" data-idx="#{b.candidate.idx}">#{esc b.candidate.name}</b> <span class="ex-rank">rank #{b.candidate.rank}</span><span class="ex-strength">#{b.strength.0}:#{b.strength.1}</span></div>"""
      if b.indirect =>
        html.push """<div class="ex-note">#{esc e.candidate.name} actually wins the head to head #{b.direct.lose}:#{b.direct.win} - overruled by this chain</div>"""
      html.push """<div class="chain">#{chain-html b.path, b.strength}</div>"""
      html.push """</div>"""

  if e.tied-with.length =>
    html.push """<p class="ex-sub">tied with #{e.tied-with.map(->esc it.name).join(', ')}.</p>"""
  if e.rank-from.above.length != e.blocked-by.length =>
    html.push """<p class="ex-sub">the number reads #{e.candidate.rank} because #{e.rank-from.above.length} project(s) are placed above it - more than the #{e.blocked-by.length} beating it, since ties above take up numbers too.</p>"""
  node.innerHTML = html.join ''

# only the Reset button wipes what was typed in. an unusable grid clears the result,
# never the input - the user is most likely still halfway through entering it.
clear-result = ->
  local.rank-col = null
  local.order = null
  detail.data [['']]
  render-explain!

clear = ->
  local := {}
  grid.data [['']]
  detail.data [['']]
  render-explain!

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
      # detail row r ( r >= 1 ) is candidate local.order[r - 1]
      local.order = pair-preference-matrix.by-rank.map -> it.0.idx
      detail.data local.detail
      render-explain!

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
  # let the wheel through to the page and scroll by the scrollbar instead - a sheet
  # that swallows wheel events is a hole the reader falls into on the way down the page.
  enable-scrolling: false
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
  # let the wheel through to the page and scroll by the scrollbar instead - a sheet
  # that swallows wheel events is a hole the reader falls into on the way down the page.
  enable-scrolling: false
  cellcfg: ({row, col, type}) ->
    if type == \readonly => return true
    if type != \class => return null
    d = local.detail
    # row r is candidate r - 1, col c is candidate c - 2. the cell facing it across the
    # diagonal is therefore [c - 1][r + 1] - skip the diagonal itself.
    if !d or row < 1 => return ''
    sel = if local.order and local.explain-idx? and local.order[row - 1] == local.explain-idx => 'picked' else ''
    if col < 2 or col == row + 1 => return sel
    v = (d[row] or [])[col]
    o = (d[col - 1] or [])[row + 1]
    if !(v?) or !(o?) => return sel
    return "#sel " + (if v > o => \win else if v < o => \lose else \tie)

grid.on \change, -> update!

# the detail sheet is read only, so a plain click is free to mean something here.
document.querySelector '#detail-grid .inner' .addEventListener \click, (e) ->
  pos = detail.index e.target
  if !pos or !local.order or !(local.order[pos.row - 1]?) => return
  idx = local.order[pos.row - 1]
  local.explain-idx = if local.explain-idx == idx => null else idx
  detail.render!
  render-explain!
  if local.explain-idx? =>
    document.querySelector '#explain' .scrollIntoView {behavior: \smooth, block: \nearest}

document.querySelector '#explain' .addEventListener \click, (e) ->
  if !(node = e.target.closest '.ex-link') => return
  local.explain-idx = +node.getAttribute \data-idx
  detail.render!
  render-explain!

update!

document.querySelector '.btn[data-action=clear]' .addEventListener \click, -> clear!
document.querySelector '.btn[data-action=sample]' .addEventListener \click, ->
  clear!
  grid.data JSON.parse(JSON.stringify sample)
  update!
