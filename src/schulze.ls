(->
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
    is-rank: false
    higher-is-better: true

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
    options = {} <<< input-default-options <<< options
    rank = json.rank
    candidate-names = json.candidateNames
    judge-names = [k for k of json.rank]
    data-validate rank, options
    return compute {data: rank, candidates: candidate-names, judges: judge-names}

  data-validate = (rank, options) ->
    for judge,list of rank =>
      for i from 0 til list.length =>
        value = list[i]
        if isNaN(value) => console.log "warning: '#value' is type NaN (#{i+1}th element for #judge)"
        list[i] = +value
      rank[judge] = list.map (v) ->
        if isNaN(v) => return v
        ret = list.filter ->
          if options.higher-is-better =>return (it > v) else return (it < v)
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

  compute = ({data, candidates, judges}) ->
    size = candidates.length

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
        p[i][j] -= b
        p[j][i] -= a

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
    rank.map (d,i) ->
      d.rank = hash[d.count].rank
      d.name = candidates[d.idx]

    detail = []
    for i from 0 til size =>
      list = [rank[i].name] ++ [d[rank[i].idx][rank[j].idx] for j from 0 til size]
      detail.push list

    return {rank, detail}

  if module? => module.exports = {compute, from-csv, from-json, from-array, to-csv}
  if window? => window.schulze = {compute, from-csv, from-json, from-array, to-csv}
)!