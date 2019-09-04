require! <[fs papaparse]>

papaparse.parse fs.read-file-sync(\g0v-grant.csv).toString!, do
  complete: -> 
    data = it.data.filter -> it.filter(-> it).length
    console.log data
    judges = data.0.length - 1
    data.splice 0, 1
    ret = []
    for j from 0 til judges
      scores = data.map (d,i) -> [i, +d[j + 1]]
      scores.sort (a,b) -> b.1 - a.1
      scores.map (d,i) -> d.1 = i + 1
      scores.sort (a,b) -> a.0 - b.0
      ret.push scores.map -> it.1
    ret = papaparse.unparse ret
    fs.write-file-sync \rank.csv, ret

/*
    for item in it.data =>
      for i from 1 til item.length =>
        item[i] = Math.round(Math.random! * 100)
    ret = papaparse.unparse it.data
    console.log ret
    fs.write-file-sync \g0v-g.csv, ret
*/
