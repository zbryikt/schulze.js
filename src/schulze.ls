if require? => require! <[papaparse]>

pad = (v, len, align-left = false) ->
  spc = (" " * (len - "#v".length))
  return if align-left => ("#v" + spc) else (spc + "#v")

output-default-options = do
  sort: false

input-default-options = do
  is-row-based: true
  higher-is-better: true
  show-warning: true

schulze = (opt = {}) ->
  @opt = opt
  # Judge object list. {name, idx}. idx is auto-generated.
  @judges = []
  # Candidate object list. {name, idx, count, rank}. idx, count and rank are calculated results.
  @candidates = []
  # Raw input data.
  @data = []
  # Refined Input data. score ( Number or NaN ) that judge i gives candidate j is score[i][j]
  @scores = []
  # Per Judge Rank. calculated from score. Rank that judge i gives to candidate j is ballot[i][j]
  @ballots = []
  @partial-rank = []

  # following members are named based on the original paper
  # candidates number
  @C = 0
  # Pair Preference Matrix
  @N = []
  # Matrix for Strength of the Strongest Path from i to j
  @P = []
  # @pred[i][j]: Predecessor of candidate j in the strongest path from candidate i to j
  @pred = []
  # measurement method. possible values: `margin`, `ratio`, `winning votes`, `losing votes`
  # we currently only implement `winning votes` algorithm
  @D = 'winning votes'
  # binary relation. [i,j] in @O if i > j
  @O = []

  return @

schulze <<< do
  to-csv: (candidates, opt = {}) ->
    c = candidates.map -> it
    ret = []
    if opt.sort => c.sort((a,b) -> if a.rank == b.rank => a.idx - b.idx else a.rank - b.rank)
    else c.sort (a,b) -> a.idx - b.idx
    return c
      .map -> "\"#{it.name.replace(/"/g,'\"')}\",#{it.rank}"
      .join \\n
      .trim!

  to-grid: (mat) ->
    maxlen = do
      name: Math.max.apply Math, mat.map((d,i) -> d.0.name.length)
      value: Math.max.apply Math, mat.map((d,i) -> Math.max.apply Math, d.slice(1).map ->"#it".length)
    return mat
        .map (p,j) ->
          p
            .map (d,i) ->
              if i == j + 1 => pad('-', maxlen.value, true)
              else if i > 0 => pad(d, maxlen.value)
              else pad(d.name, maxlen.name, true)
            .join(' ')
        .join(\\n)
        .trim!

schulze.prototype = Object.create(Object.prototype) <<< do
  to-csv: (opt) ->
    if !@_result => @compute!
    schulze.to-csv @_result.candidates, opt

  to-grid: (opt) ->
    if !@_result => @compute!
    schulze.to-grid @_result.pair-preference-matrix[if opt.by-index => "byIndex" else "byRank"]

  from-array: (data, opt = {}) ->
    @opt = opt = {} <<< input-default-options <<< opt
    Promise.resolve!then ~>
      @data = data
      [candidate-names, judge-names] = [
        data.map(->it.0), JSON.parse(JSON.stringify(data.0))
      ].map(-> it.slice 1, it.length)
      if opt.is-row-based => [candidate-names, judge-names] = [judge-names, candidate-names]
      @judges = judge-names.map (name,idx) -> {name,idx}
      @candidates = candidate-names.map (name,idx) -> {name,idx}
      @C = @candidates.length
      @compute opt

  from-json: (json, opt = {}) ->
    @opt = opt = {} <<< input-default-options <<< opt
    Promise.resolve!then ~>
      if typeof(json) == \string => json := JSON.parse(json)
      @candidates = json.candidates.map (name,idx) -> {name,idx}
      @C = @candidates.length
      @judges = [k for k of json.scores].map (name,idx) -> {name,idx}
      @data = [([''] ++ @candidates.map(->it.name))] ++ @judges.map((j) -> [j.name] ++ json.scores[j.name])
      # json input is always row based by its definition
      opt.is-row-based = true
      @compute opt

  from-csv: (csv, opt = {}) ->
    @opt = opt = {} <<< input-default-options <<< opt
    Promise.resolve!then ~>
      if !(papaparse?) => return Promise.reject(new Error("error: papaparse not found."))
      data = papaparse.parse(csv).data
      data = data.filter -> it.filter(->it).length
      @from-array data, opt

  # return max / min of p1, p2 based on gt 
  max: (p1, p2) -> return if @gt(p1,p2) => p1 else p2
  min: (p1, p2) -> return if @gt(p1,p2) => p2 else p1

  # return true if strength for pair p1 = (e,f) is greater than pair p2 = (g,h)
  gt: (p1, p2) ->
    [ef,fe] = p1
    [gh,hg] = p2
    # winning votes method
    if ef > fe => return (gh <= hg) or (gh > hg and ((ef > gh) or (ef == gh and fe < hg)))
    if ef == fe => return gh < hg
    if ef < fe => return gh < hg and (fe < hg or (fe == hg and ef > gh))
    return false


  get-ballots: (opt={}) ->
    data = @data
    @scores = scores = if !opt.is-row-based =>
      [[data[i][j] for i from 1 til data.length] for j from 1 til data.0.length]
    else
      [[data[i][j] for j from 1 til data.0.length] for i from 1 til data.length]
    # 1. convert from arbitrary score to ranking, and
    # 2. data validation ( convert to number or NaN )
    @ballots = @judges.map (j) ~>
      ballot = @scores[j.idx]
      # data validation / cleaning
      for i from 0 til ballot.length =>
        value = ballot[i]
        if isNaN(value) and opt.show-warning =>
          console.log "warning: '#value' is type NaN (#{i+1}th element for #{j.name})"
        ballot[i] = +value
      ballot.map (v) ->
        if isNaN(v) =>
          # even if values are undefined, we still give them a rank, or ...
          #return ballot.length - ballot.filter(-> isNaN(it)).length + 1
          # ... just state that this value is undefined. pair-preference-matrix calculation will handle this.
          return v
        ret = ballot.filter ->
          if opt.higher-is-better => return (it > v) else return (it < v)
        return ret.length + 1
    return @ballots

  # Calculate and return Pairwise Preference Matrix (PPM).
  #  - option:
  #    - invalid-type: how do we handle invalid rank ( undefined, NaN, etc )
  #      - `A`: just ignore ( default value )
  #      - `B`: ranked items are preferred than all unranked. indifference between unranked.
  #  - return value: PPM. PPM is also updated to @N.
  pair-preference-matrix: (opt = {invalid-type: \A}) ->
    @N = for i from 0 til @C => for j from 0 til @C => 0
    for judge in @judges =>
      ballot = @ballots[judge.idx]
      for i from 0 til @C => for j from 0 til @C =>
        switch opt.invalid-type
        # A : count only when both i or j is defined.
        #     treat all undefined rank in-comparable. CIVS use this option.
        | \A
          if isNaN(ballot[i]) or isNaN(ballot[j]) => continue
          if ballot[i] < ballot[j] => @N[i][j]++
        # B : count only when rank j is not defined
        #     in this case, all rank-defined candidates are prefered then all rank-undefined candidates.
        #     and no difference between all rank-undefined candidates.
        #     this is one of the possible implementation in Schulze's paper
        | \B
          if isNaN(ballot[i]) => continue
          if isNaN(ballot[j]) or ballot[i] < ballot[j] => @N[i][j]++
        | otherwise => new Error("calculating pair-preference-matrix: undefined invalid-type")
    return @N

  # Calculating Strength of the Strongest Path Matrix (SSPM)
  strength-of-strongest-path-matrix: ->
    [C, N] = [@C, @N]
    # initialization
    @P = P = for i from 0 til C => for j from 0 til C => [0,0]
    @pred = pred = for i from 0 til C => for j from 0 til C => -1
    for i from 0 til C => for j from 0 til C
      if i == j => continue
      P[i][j] = [N[i][j], N[j][i]]
      pred[i][j] = i
    # calculation
    for i from 0 til C => for j from 0 til C
      if i == j => continue
      for k from 0 til C
        if i == k or j == k => continue
        min-pair = @min(P[j][i],P[i][k])
        if @gt(min-pair, P[j][k]) =>
          P[j][k] = min-pair
          pred[j][k] = pred[i][k]
    return P

  # get final ranking of all candidates. it's a strict partial order.
  #  - return value: 2D Array `rank`.
  #    each entry is an array containing all idx of candidates that share the same rank.
  partial-order: ->
    [C, P] = [@C, @P]
    @O = []
    # rank: final ranking of each candidate. 
    # - each entry is an array containing all idx of candidates that share the same rank.
    rank = []
    # picked: picked[i] true if candidate i already won and should be excluded from the reamining group
    picked = {}
    while rank.length < C
      winner = []
      for i from 0 til C
        if picked[i] => continue
        win = true
        for j from 0 til C
          if picked[j] => continue
          if i == j => continue
          if @gt(P[j][i], P[i][j]) =>
            win = false
            @O.push [j,i]
        if !win => continue
        winner.push i
      if !winner.length => break
      winner.map -> picked[it] = true
      count = C - [k for k of picked].length + winner.length - 1
      winner.sort (a,b) -> a - b
      rank.push winner.map (idx) -> {idx, count}
    @partial-rank = rank

  compute: (opt) ->
    opt = opt or @opt or {}
    @get-ballots opt
    @pair-preference-matrix!
    @strength-of-strongest-path-matrix!
    @partial-order!
    ranks = @partial-rank
      .reduce(((a,b) -> a ++ b), [])
      .map (c) ~> c <<< {rank: @C - c.count, name: @candidates[c.idx].name}

    by-index = @N.map (d,i) -> [ranks.filter(->it.idx == i).0] ++ d
    by-rank = [0 til @C].map (d,i) ~> [ranks[i]] ++ [0 til @C].map(->0)
    for i from 0 til @C => for j from 0 til @C
        by-rank[i][j + 1] = @N[ranks[i].idx][ranks[j].idx]

    return @_result = {
      candidates: ranks
      pair-preference-matrix: { by-index: by-index, by-rank: by-rank }
    }

if module? => module.exports = schulze
else if window? => window.schulze = schulze
