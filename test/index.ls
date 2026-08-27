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
