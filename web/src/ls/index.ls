data = [
  ["Candidates", "John", "Joe", "David", "Mary"],
  ["Cand 1", 90, 60, 80, 70],
  ["Cand 2", 80, 50, 70, 60],
  ["Cand 3", 70, 40, 60, 50],
  ["Cand 4", 60, '', 50, 40],
  ["Cand 5", 50, 20, '', 30],
]

# a read-only illustration of the input format - `dim` trims the rendered window down to
# exactly the data, so there is no empty space or scrolling around it.
new sheet do
  root: '#sample-form .inner'
  data: data
  editing: false
  enable-scrolling: false
  idx: {row: false, col: false}
  dim: {row: data.length, col: data.0.length}
  frozen: {row: 1, col: 1}
  size: {col: ['12em']}
  class: {col: ['name']}
