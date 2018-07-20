require! <[./index fs]>

index.from-json JSON.parse(fs.read-file-sync('somedata.json').toString!)
ret = index.from-csv fs.read-file-sync('somedata.csv').toString!
output = index.to-csv ret, {sort: true}
console.log output
