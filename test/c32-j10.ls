require! <[fs ./src/schulze assert]>

output = schulze.fromCsv(
  fs.read-file-sync('../dataset/rand-c32-j10/dataset.csv').toString!
  {isRowBased: false, higher-is-better: false, show-warning: false}
)
grid = schulze.to-grid output, {byIndex: true} .trim!

console.log grid
