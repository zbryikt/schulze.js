if require? => require! <[papaparse]>

# Row Based:
# Item  JudgeA JudgeB JudgeC
# Cand1      1      2      3
# Cand2      2      1      4
# Cand3      3      1      1

# Column Based:
# Judge  Cand1 Cand2 Cand3
# JudgeA     1     2     3
# JudgeB     2     1     1
# JudgeC     3     4     1

# Json:
# {
#   rank: {
#     "JudgeA": [1,2,3],
#     "JudgeB": [2,1,1],
#     "JudgeC": [3,4,1],
#   }, candidateNames: [
#     "Cand1", "Cand2", "Cand3"
#   ]
# }

output-default-options = do
  sort: false

input-default-options = do
  is-row-based: true
  higher-is-better: true
  show-warning: true

to-grid = (computed, options = {}) ->
  mat = computed.pairPreferenceMatrix[if options.by-index => "byIndex" else "byRank"]
  maxlen = do
    name: Math.max.apply Math, mat.map((d,i) -> d.0.name.length)
    value: Math.max.apply Math, mat.map((d,i) -> Math.max.apply Math, d.slice(1).map ->"#it".length)
  pad = (v, len, align-left = false) ->
    spc = (" " * (len - "#v".length))
    return if align-left => ("#v" + spc) else (spc + "#v")
  return mat
      .map (p,j) ->
        p
          .map (d,i) ->
            if i == j + 1 => pad('-', maxlen.value, true)
            else if i > 0 => pad(d, maxlen.value)
            else pad(d.name, maxlen.name, true)
          .join(' ')
      .join(\\n)

to-csv = (computed, options = {}) ->
  ret = []
  if options.sort => computed.sort (a,b) -> a.rank - b.rank
  else computed.sort (a,b) -> a.idx - b.idx
  for item in computed => ret.push "\"#{item.name.replace(/"/g,'\"')}\",#{item.rank}"
  return ret.join(\\n)

from-array = (data, options = {}) ->
  options = {} <<< input-default-options <<< options
  rank = {}
  [candidate-names, judge-names] = [
    data.map(->it.0), JSON.parse(JSON.stringify(data.0))
  ].map(-> it.slice 1, it.length)
  if !options.is-row-based => [candidate-names, judge-names] = [judge-names, candidate-names]
  score = if options.is-row-based => [[data[i][j] for i from 1 til data.length] for j from 1 til data.0.length]
  else [[data[i][j] for j from 1 til data.0.length] for i from 1 til data.length]
  for i from 0 til judge-names.length => rank[judge-names[i]] = score[i]
  data-validate rank, options
  return compute {data: rank, candidates: candidate-names, judges: judge-names}

from-json = (json, options = {}) ->
  if typeof(json) == \string => json = JSON.parse(json)
  options = {} <<< input-default-options <<< options
  rank = json.rank
  candidate-names = json["candidateNames"]
  judge-names = [k for k of json.rank]
  data-validate rank, options
  return compute {data: rank, candidates: candidate-names, judges: judge-names}

data-validate = (rank, options) ->
  for judge,list of rank =>
    for i from 0 til list.length =>
      value = list[i]
      if isNaN(value) and options.show-warning =>
        console.log "warning: '#value' is type NaN (#{i+1}th element for #judge)"
      list[i] = +value
    rank[judge] = list.map (v) ->
      if isNaN(v) => return v
      ret = list.filter ->
        if options.higher-is-better => return (it > v) else return (it < v)
      return ret.length + 1

from-csv = (csv, options = {}) ->
  if !(papaparse?) => throw new Error("error: papaparse not found.")
  options = {} <<< input-default-options <<< options
  data = papaparse.parse(csv).data
  data = data.filter -> it.filter(->it).length
  rank = {}
  [candidate-names, judge-names] = [
    data.map(->it.0), JSON.parse(JSON.stringify(data.0))
  ].map(-> it.slice 1, it.length)
  if !options.is-row-based => [candidate-names, judge-names] = [judge-names, candidate-names]
  score = if options.is-row-based => [[data[i][j] for i from 1 til data.length] for j from 1 til data.0.length]
  else [[data[i][j] for j from 1 til data.0.length] for i from 1 til data.length]
  for i from 0 til judge-names.length => rank[judge-names[i]] = score[i]
  data-validate rank, options
  return compute {data: rank, candidates: candidate-names, judges: judge-names}

minimax = ({data, candidates, judges}) ->
  size = candidates.length
  d = for i from 0 til size => for j from 0 til size => 0
  d2 = for i from 0 til size => for j from 0 til size => 0
  for judge in judges =>
    rank = data[judge]
    for i from 0 til size => for j from 0 til size => if rank[i] < rank[j] => d2[i][j]++
  for i from 0 til size => for j from 0 til size => d[i][j] = d2[i][j] - d2[j][i]
  [mxs,mins] = [[],[]]
  remains = [0 til size]
  for k from 0 til size =>
    if !remains.length => break
    [min, mx] = [judges.length, []]
    for x in remains =>
      [max,my] = [0,0]
      for y in remains => if x != y and max < d[y][x] => [max, my] = [d[y][x], y]
      if max < min => [min,mx] = [max, [x]]
      else if max == min => mx.push x
    remains = remains.filter -> !(it in mx)
    mxs.push mx
    mins.push min

  [rank,detail,r] = [[],[],1]
  for i from 0 til mxs.length =>
    mxs[i].map (d) -> rank.push { rank: r, idx: d, count: mins[i], name: candidates[d] }
    r = r + mxs[i].length

  for i from 0 til size =>
    list = [rank[i].rank, rank[i].name] ++ [d[rank[i].idx][rank[j].idx] for j from 0 til size]
    detail.push list

  return {rank, detail}

compute = ({data, candidates, judges}) ->
  size = candidates.length

  # calculate pairwise preference matrix
  d = for i from 0 til size => for j from 0 til size => 0
  for judge in judges =>
    rank = data[judge]
    for i from 0 til size => for j from 0 til size =>
      # A. count only when both i or j is defined.
      #    treat all undefined rank in-comparable. CIVS use this option.
      if isNaN(rank[i]) or isNaN(rank[j]) => continue

      # B. count only when rank j is not defined
      #    in this case, all rank-defined candidates are prefered then all rank-undefined candidates.
      #    and no difference between all rank-undefined candidates.
      #    this is one of the possible implementation in Schulze's paper
      #if !isNaN(rank[i]) and !isNaN(rank[j]) =>
      #  d[i][j]++
      #  continue

      if rank[i] < rank[j] => d[i][j]++

  # remove paths that lose.
  p = for i from 0 til size => for j from 0 til size => 0
  for i from 0 til size
    for j from 0 til size
      if i == j => continue
      if d[i][j] > d[j][i] => p[i][j] = d[i][j] else p[i][j] = 0

  # strongest path by Floyd-Warshall algorithm
  for k from 0 til size
    for i from 0 til size
      if k == i => continue
      for j from 0 til size
        if j == i or j == k => continue
        p[i][j] = Math.max(p[i][j], Math.min(p[i][k], p[k][j]))

  # ranking
  for i from 0 til size
    for j from 0 til size
      a = p[i][j]
      b = p[j][i]
      p[i][j] -= b
      p[j][i] -= a
  # candidates ordered by rank, with additional information ( original index, ranking order, etc. )
  candidates-by-rank = []
  hash = {}
  for i from 0 til size =>
    count = 0
    # how many candidates did i win? ( win count )
    #for j from 0 til size => if i != j and p[i][j] >= 0 => count++
    for j from 0 til size => if p[i][j] >= 0 => count++
    # aggregate the number of with same win count
    if hash[count]? => hash[count].count++ else hash[count] = {count: 1, rank: 0}
    candidates-by-rank.push {idx: i, count: count}
  candidates-by-rank.sort (a,b) -> b.count - a.count
  sum = 1
  # order by win count, and calculate the actual rank ( for those with the same win count )
  list = [[k,v] for k,v of hash]
  list.sort (a,b) -> b.0 - a.0
  for [k,v] in list =>
    v.rank = sum
    sum += v.count

  candidates-by-rank.map (d,i) ->
    d.rank = hash[d.count].rank
    d.name = candidates[d.idx]
  candidates-by-index = candidates-by-rank.map -> it
  candidates-by-index.sort (a,b) -> a.idx - b.idx

  # pair-preference-matrix - entries ordered by candidate index.
  by-index = d.map (d,i) -> [candidates-by-index[i]] ++ d

  # pair-preference-matrix - entries ordered by candidate final ranking
  by-rank = candidates-by-rank.map (ci,i) ->
    [ci] ++ candidates-by-rank.map (cj,j) -> d[ci.idx][cj.idx]

  return {candidates: candidates-by-rank, pair-preference-matrix: {by-rank, by-index}}

if module? => module.exports = {compute, from-csv, from-json, from-array, to-csv, to-grid}
else if window? => window.schulze = {compute, from-csv, from-json, from-array, to-csv, to-grid}
