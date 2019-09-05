data = [
  ["Candidates", "John", "Joe", "David", "Mary"],
  ["Cand 1", 90, 60, 80, 70],
  ["Cand 2", 80, 50, 70, 60],
  ["Cand 3", 70, 40, 60, 50],
  ["Cand 4", 60, '', 50, 40],
  ["Cand 5", 50, 20, '', 30],
]

hot = new Handsontable(document.querySelector('#sample-form .inner'), {
  data: data,
  rowHeaders: true,
  colHeaders: true,
  filters: true,
  dropdownMenu: true
  rowHeights: 35
  colWidths: 80
  modifyColWidth: (w, col) -> if col == 0 => return 300
  stretchH: \all
})
