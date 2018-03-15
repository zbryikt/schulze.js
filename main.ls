require! <[fs]>
data = JSON.parse(fs.read-file-sync \test-data.json .toString!)

judges = [k for k of data]
size = data[judges.0].length

d = for i from 0 til size => for j from 0 til size => 0
p = for i from 0 til size => for j from 0 til size => 0
for judge in judges =>
  rank = data[judge]
  for i from 0 til size => for j from 0 til size => if rank[i] < rank[j] => d[i][j]++

for i from 0 til size
  for j from 0 til size
    if i == j => continue
    if d[i][j] > d[j][i] => p[i][j] = d[i][j] else p[i][j] = 0

for i from 0 til size
  for j from 0 til size
    if i == j => continue
    for k from 0 til size
      if i == k or j == k => continue
      p[j][k] = Math.max(p[j][k], Math.min(p[j][i], p[i][k]))

for i from 0 til size
  for j from 0 til size =>
    a = p[i][j]
    b = p[j][i]
    #p[i][j] -= b
    #p[j][i] -= a

rank = []
hash = {}
for i from 0 til size =>
  count = 0
  for j from 0 til size =>
    if p[i][j] > 0 => count++
  if hash[count]? => hash[count].count++ else hash[count] = {count: 1, rank: 0}
  rank.push {idx: i, count: count}

rank.sort (a,b) -> b.count - a.count
sum = 1
list = [[k,v] for k,v of hash]
list.sort (a,b) -> b.0 - a.0

for [k,v] in list =>
  v.rank = sum
  sum += v.count
rank.map (d,i) -> d.rank = hash[d.count].rank
console.log rank

#console.log p
