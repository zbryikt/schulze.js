data = [
  ["", "Judge John", "Judge Joe", "Judge Jacob", "Judge Judy"],
  ["Sakura", 90, 60, 80, 70],
  ["Sasuke", 80, 50, 70, 60],
  ["Naruto", 70, 40, 60, 50],
  ["Kakasi", 60, '', 50, 40],
  ["Itachi", 50, 20, '', 30],
]

hot = new Handsontable(document.querySelector('#grid .inner'), {
  data: data,
  rowHeaders: true,
  colHeaders: true,
  filters: true,
  dropdownMenu: true
  afterChange: onchange
  rowHeights: 35
  colWidths: 100
})


count = {row: hot.countRows!, col: hot.countCols!}
hot.alter("insert_col",count.col)
hot.updateSettings cells: (r, c) -> if c == count.col => return {readOnly: true} else return {}

update = ->
  votes = JSON.parse(JSON.stringify(data))
  votes.map -> it.splice it.length - 1, 1
  ret = from-array votes, {}
  hot.setDataAtCell 0, count.col, 'Rank'
  for i from 0 til ret.length => 
    cand = ret[i]
    hot.setDataAtCell (cand.idx + 1), (count.col), cand.rank

update!

onchange = -> update!
