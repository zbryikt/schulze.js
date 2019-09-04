require! <[ fs]>
schulze = require "./src/index"

# Load JSON example
#schulze.from-json JSON.parse(fs.read-file-sync('somedata.json').toString!)

# Load CSV Example
ret = schulze.from-csv fs.read-file-sync('../sample-data/game.csv').toString!, {isRowBased: true}
output = schulze.to-csv ret, {sort: true}
console.log output

ret = schulze.from-csv fs.read-file-sync('../sample-data/g0v-grant.csv').toString!, {}
console.log ret

