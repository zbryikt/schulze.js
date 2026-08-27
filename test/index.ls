require! <[fs path assert]>
schulze = require '../src/index'

that = it

describe 'options', ->
  #is-row-based
  #higer-is-better

describe 'output format', ->
  that "to-csv ( with simple dataset )", ->
    vote = new schulze!
    vote.from-json(
      fs.read-file-sync('dataset/simple/dataset.json').toString!
      {higher-is-better: false, show-warning: false}
    )
      .then (output) ->
        ret = schulze.toCsv output.candidates
        assert.equal ret, fs.read-file-sync('dataset/simple/answer.csv').toString!, new Error("output mismatch")

  that "to-grid ( with rand-c7-j100 dataset )", ->
    vote = new schulze!
    vote.from-csv(
      fs.read-file-sync('dataset/rand-c7-j100/dataset.csv').toString!
      {is-row-based: true, higher-is-better: false, show-warning: false}
    )
      .then (output) ->
        ret = schulze.to-grid output.pair-preference-matrix.by-index .trim!
        assert.equal(
          ret,
          fs.read-file-sync('dataset/rand-c7-j100/answer.grid.txt').toString!trim!,
          new Error("output mismatch")
        )

describe 'different input sourec', ->
  that "from-json ( with simple dataset )", ->
    vote = new schulze!
    vote.from-json(
      fs.read-file-sync('dataset/simple/dataset.json').toString!
      {higher-is-better: false, show-warning: false}
    )
      .then ->
        output-rank = vote.to-csv sort: true
        answer-rank = fs.read-file-sync 'dataset/simple/answer.rank.txt' .toString!trim!
        assert.deep-strict-equal output-rank, answer-rank, new Error("output mismatch")

  that "from-csv ( with rand-c7-j100 dataset )", ->
    vote = new schulze!
    vote.from-csv(
      fs.read-file-sync('dataset/rand-c7-j100/dataset.csv').toString!
      {is-row-based: true, higher-is-better: false, show-warning: false}
    )
      .then (output) ->
        output-rank = vote.to-csv {sort: true}
        answer-rank = fs.read-file-sync 'dataset/rand-c7-j100/answer.rank.txt' .toString!trim!
        assert.deep-strict-equal output-rank, answer-rank, new Error("output mismatch")

  that "from-array ( with rand-c5-j5 dataset )", ->
    vote = new schulze!
    vote.from-array(
      JSON.parse(fs.read-file-sync('dataset/rand-c5-j5/dataset.json').toString!)
      {is-row-based: true, higher-is-better: false, show-warning: false}
    )
      .then (output) ->
        output-rank = vote.to-csv {sort: true}
        answer-rank = fs.read-file-sync 'dataset/rand-c5-j5/answer.rank.txt' .toString!trim!
        assert.deep-strict-equal output-rank, answer-rank, new Error("output mismatch")

check = (dataset) ->
  vote = new schulze!
  vote.fromCsv(
    fs.read-file-sync(path.join(\dataset,dataset,\dataset.csv)).toString!
    {isRowBased: true, higher-is-better: false, show-warning: false}
  )
    .then ->
      output-grid = vote.to-grid {by-index: true}
      output-rank = vote.to-csv {sort: true}
      answer-grid = fs.read-file-sync(path.join(\dataset,dataset,\answer.grid.txt)).toString!trim!
      answer-rank = fs.read-file-sync(path.join(\dataset,dataset,\answer.rank.txt)).toString!trim!
      assert.deep-strict-equal output-grid, answer-grid, new Error("output mismatch (grid) ")
      assert.deep-strict-equal output-rank, answer-rank, new Error("output mismatch (rank) ")

describe 'output for sample dataset', ->
  that "dataset wiki-schulze-method", -> check \wiki-schulze-method
  that "dataset rand-c5-j5", -> check \rand-c5-j5
  that "dataset rand-c32-j10", -> check \rand-c32-j10
  that "dataset rand-c7-j100", -> check \rand-c7-j100
  that "dataset rand-c200-j20", -> check \rand-c200-j20

describe 'invalid input handling', ->
  # `isNaN('')` and `isNaN(null)` are both false, so these used to be read as a score of 0.
  that "empty and null cells are unranked, not 0", ->
    vote = new schulze!
    vote.from-array-sync(
      [<[j A B C]>, ['j1', 1, 2, ''], ['j2', 1, 2, null]]
      {higher-is-better: false, show-warning: false}
    )
    for ballot in vote.ballots
      assert.deep-strict-equal ballot.slice(0,2), [1,2], new Error("valid scores mis-ranked")
      assert.ok isNaN(ballot.2), new Error("empty cell should be unranked")

  that "invalidType B prefers ranked candidates over unranked ones", ->
    vote = new schulze!
    vote.from-array-sync(
      [<[j A B C]>, ['j1', 1, 2, ''], ['j2', 1, 2, '']]
      {higher-is-better: false, show-warning: false, invalid-type: \B}
    )
    assert.deep-strict-equal vote.N, [[0,2,2],[0,0,2],[0,0,0]], new Error("output mismatch")

  that "unknown invalidType throws", ->
    vote = new schulze!
    assert.throws(
      -> vote.from-array-sync [<[j A]>, ['j1', 1]], {show-warning: false, invalid-type: \Z}
      /unknown invalid-type/
    )

describe 'output format edge cases', ->
  that "to-grid works without an option", ->
    vote = new schulze!
    vote.from-array-sync(
      [<[j A B C]>, ['j1', 1, 2, 3], ['j2', 2, 1, 3], ['j3', 3, 1, 2]]
      {higher-is-better: false, show-warning: false}
    )
    assert.equal typeof(vote.to-grid!), \string, new Error("to-grid() should not throw")

  that "to-csv escapes double quotes", ->
    assert.equal(
      schulze.to-csv([{name: 'a"b', idx: 0, rank: 1}])
      '"a""b",1'
      new Error("output mismatch")
    )

# deterministic pseudo random, so a failing case is reproducible
rand = do ->
  seed = 20260827
  -> (seed := (seed * 1103515245 + 12345) % 2147483648) / 2147483648

random-dataset = (C, J) ->
  [([''] ++ [0 til C].map(-> "c#it"))] ++ [0 til J].map (j) ->
    ["j#j"] ++ [0 til C].map -> Math.floor(rand! * 4)

describe 'explanation', ->
  # `pred` is written by strength-of-strongest-path-matrix but was never read until
  # `path` came along, so pin its invariant down: every rebuilt path must be a real
  # chain whose weakest link is exactly the strength recorded in P.
  that "path rebuilds a real strongest path for every pair", ->
    checked = 0
    for t from 0 til 40
      vote = new schulze!
      C = 3 + Math.floor(rand! * 5)
      vote.from-array-sync random-dataset(C, 2 + Math.floor(rand! * 6)), {show-warning: false}
      for e from 0 til C => for f from 0 til C
        if e == f => continue
        hops = vote.path e, f
        assert.ok (hops and hops.length), new Error("no path rebuilt for #e -> #f")
        assert.equal hops.0.from, e, new Error("path does not start at #e")
        assert.equal hops[hops.length - 1].to, f, new Error("path does not end at #f")
        weakest = hops.reduce ((a, h) -> if !a => [h.win, h.lose] else vote.min a, [h.win, h.lose]), null
        assert.deep-strict-equal weakest, vote.P[e][f], new Error("weakest link != P[#e][#f]")
        checked++
    assert.ok (checked > 500), new Error("expected a decent number of pairs, got #checked")

  that "rank is 1 + the candidates placed above, which may exceed the beaten-by count", ->
    loose = 0
    for t from 0 til 40
      vote = new schulze!
      C = 3 + Math.floor(rand! * 5)
      out = vote.from-array-sync random-dataset(C, 2 + Math.floor(rand! * 6)), {show-warning: false}
      for c in out.candidates
        e = vote.explain c.idx
        assert.equal e.candidate.rank, e.rank-from.above.length + 1, new Error("rank mismatch")
        if e.rank-from.above.length > e.blocked-by.length => loose := loose + 1
    # the two counts differing is the whole reason `rank-from` exists - make sure the
    # dataset actually exercises it, or this test proves nothing.
    assert.ok (loose > 0), new Error("no case where ties above inflate the rank")

  that "explain reports the chain that overrules a head to head ( wiki dataset )", ->
    vote = new schulze!
    vote.from-csv(
      fs.read-file-sync('dataset/wiki-schulze-method/dataset.csv').toString!
      {is-row-based: true, higher-is-better: false, show-warning: false}
    )
      .then ->
        e = vote.explain \c
        assert.equal e.candidate.rank, 3, new Error("unexpected rank")
        assert.deep-strict-equal e.blocked-by.map(->it.candidate.name), <[e a]>, new Error("unexpected blockers")
        [blocker] = e.blocked-by
        assert.ok (blocker.indirect), new Error("e beating c should be an indirect win")
        assert.deep-strict-equal blocker.direct, {win: 21, lose: 24}, new Error("head to head mismatch")
        assert.deep-strict-equal(
          blocker.path.map -> "#{vote.candidates[it.from].name}>#{vote.candidates[it.to].name} #{it.win}:#{it.lose}"
          ['e>d 31:14', 'd>c 28:17']
          new Error("unexpected chain")
        )
        assert.ok (/overruled by this chain/.exec(vote.to-explanation \c)), new Error("text form lost the chain")

  that "the top candidate is beaten by nobody", ->
    vote = new schulze!
    vote.from-array-sync(
      [<[j A B C]>, ['j1', 3, 2, 1], ['j2', 3, 1, 2], ['j3', 3, 2, 1]]
      {show-warning: false}
    )
    e = vote.explain \A
    assert.equal e.candidate.rank, 1, new Error("A should win")
    assert.deep-strict-equal e.blocked-by, [], new Error("nothing should beat A")
    assert.ok (/nothing beats it/.exec(vote.to-explanation \A)), new Error("text form mismatch")

  that "explain rejects an unknown candidate", ->
    vote = new schulze!
    vote.from-array-sync [<[j A B]>, ['j1', 1, 2]], {show-warning: false}
    assert.throws (-> vote.explain \nope), /no such candidate/
