require! <[fs ./core]>
#csv = fs.read-file-sync '../dataset/wiki-schulze-method/dataset.csv' .toString!
csv = fs.read-file-sync '../dataset/rand-c5-j5/dataset.csv' .toString!
schulze = new core!
schulze.from-csv csv, {is-row-based: true, higher-is-better: false, show-warning: false}
  .then ->
    console.log it
    console.log it.pair-preference-matrix.byIndex
    console.log it.pair-preference-matrix.byRank

