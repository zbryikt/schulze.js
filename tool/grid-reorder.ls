require! <[fs yargs]>
argv = yargs
  .option \input, do
    alias: \i
    description: "input file name"
    type: \string
  .help \help
  .alias \help, \h
  .check (argv, options) ->
    if !argv.i => throw new Error("no input file specified")
    return true
  .argv

input = argv.i

grid = fs.read-file-sync input
  .toString!
  .split \\n
  .map -> it.split(' ').filter(-> it != '')
  .filter -> it and it.length

candidates = grid.map (d,i) -> {name: d.0, order-in-grid: i}
candidates.sort (a,b) -> if a.name > b.name => 1 else if a.name < b.name => -1 else 0

maxlen = do
  name: Math.max.apply Math, candidates.map(-> it.name.length)
  value: Math.max.apply Math, grid.map(-> Math.max.apply Math, it.slice(1).map(-> "#it".length))
pad = (v,c,la) ->
  spc = " " * (c - "#v".length)
  return if la => ("#v" + spc) else (spc + "#v")

len = candidates.length
ordered-grid = [0 til len].map (d,i) -> [candidates[d].name] ++ [0 til len].map(->0)
for i from 0 til len
  for j from 1 to len
    ordered-grid[i][j] = grid[candidates[i].order-in-grid][candidates[j - 1].order-in-grid + 1]

ret = ordered-grid
  .map -> ([pad(it.0,maxlen.name,true)] ++ it.slice(1).map(->pad(it,maxlen.value,isNaN(it)))).join(' ')
  .join(\\n)

console.log ret
