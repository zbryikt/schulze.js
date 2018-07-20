require! <[./index fs]>

# Load JSON example
#index.from-json JSON.parse(fs.read-file-sync('somedata.json').toString!)

# Load CSV Example
ret = index.from-csv fs.read-file-sync('sample-data/game.csv').toString!, {isRowBased: true}
output = index.to-csv ret, {sort: true}
console.log output
