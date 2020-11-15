require! <[fs ../src/schulze assert]>

that = it

describe 'output format', ->
  that "toCsv ( with simple dataset )", ->
    output = schulze.from-json(
      fs.read-file-sync('dataset/simple/dataset.json').toString!
      {higher-is-better: false, show-warning: false}
    )
    ret = schulze.toCsv output.candidates
    assert.equal ret, fs.read-file-sync('dataset/simple/answer.csv').toString!
  that "toGrid ( with rand-c7-j100 dataset )", ->
    output = schulze.fromCsv(
      fs.read-file-sync('dataset/rand-c7-j100/dataset.csv').toString!
      {isRowBased: false, higher-is-better: false, show-warning: false}
    )
    ret = schulze.to-grid output, {byIndex: false}
    assert.equal(
      ret,
      fs.read-file-sync('dataset/rand-c7-j100/grid.txt').toString!,
      new Error("output doesn't match `dataset/rand-c7-j100/grid.txt`")
    )

describe 'different input sourec', ->
  that "fromJson ( with simple dataset )", ->
    output = schulze.from-json(
      fs.read-file-sync('dataset/simple/dataset.json').toString!
      {higher-is-better: false, show-warning: false}
    )
    answer = JSON.parse(fs.read-file-sync 'dataset/simple/answer.json' .toString!)
    assert.deep-strict-equal output, answer

  that "fromCsv ( with rand-c7-j100 dataset )", ->
    output = schulze.fromCsv(
      fs.read-file-sync('dataset/rand-c7-j100/dataset.csv').toString!
      {isRowBased: false, higher-is-better: false, show-warning: false}
    )
    answer = JSON.parse(fs.read-file-sync 'dataset/rand-c7-j100/answer.json' .toString!)
    assert.deep-strict-equal output, answer

describe 'output for sample dataset', ->
  that "dataset rand-c7-j100", ->
    input = fs.read-file-sync 'dataset/rand-c7-j100/dataset.csv'
      .toString!
      .split \\n
      .map (d,i) -> d.split(\,)
    output = schulze.fromArray input, {isRowBased: false, higher-is-better: false, show-warning: false}
    answer = JSON.parse(fs.read-file-sync 'dataset/rand-c7-j100/answer.json' .toString!)
    assert.deep-strict-equal output, answer

  that "dataset wiki-schulze-method", ->
    json = fs.read-file-sync "dataset/wiki-schulze-method/dataset.csv"
      .toString!
      .split \\n
      .map -> it.split \,
    output = schulze.fromArray json, {isRowBased: false, higher-is-better: false, show-warning: false}
    answer = JSON.parse(fs.read-file-sync 'dataset/wiki-schulze-method/answer.json' .toString!)
    assert.deep-strict-equal output, answer

  #that "dataset rand-c5-j5", ->

  that "dataset rand-c32-j10", ->
    output = schulze.fromCsv(
      fs.read-file-sync('dataset/rand-c32-j10/dataset.csv').toString!
      {isRowBased: false, higher-is-better: false, show-warning: false}
    )
    answer = fs.read-file-sync 'dataset/rand-c32-j10/answer.txt' .toString!
    output = output.pairPreferenceMatrix.byRank
        .map (p,j) ->
          p
            .map (d,i) -> if i == j + 1 => '-' else if i > 0 => d else (d.name + " " * (4 - d.name.length))
            .join(' ')
        .join(\\n)
    assert.deep-strict-equal output, answer, new Error("output doesn't match `dataset/rand-c32-j10/answer.txt`")
