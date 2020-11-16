require! <[fs path ../src/schulze assert]>

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
