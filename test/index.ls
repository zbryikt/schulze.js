require! <[fs ../src/schulze assert]>

that = it

describe 'output format', ->
  that "toCsv", ->
    output = schulze.from-json(
      fs.read-file-sync('test/sample/simple.json').toString!
      {higher-is-better: false, show-warning: false}
    )
    ret = schulze.toCsv output.candidates
    assert.equal ret, fs.read-file-sync('test/sample/simple.result.csv').toString!


describe 'different input sourec', ->
  that "fromJson", ->
    output = schulze.from-json(
      fs.read-file-sync('test/sample/simple.json').toString!
      {higher-is-better: false, show-warning: false}
    )
    answer = JSON.parse(fs.read-file-sync 'test/sample/simple.result.json' .toString!)
    assert.deep-strict-equal output, answer

  that "fromCsv", ->
    output = schulze.fromCsv(
      fs.read-file-sync('test/sample/random-c7-j100.csv').toString!
      {isRowBased: false, higher-is-better: false, show-warning: false}
    )
    answer = JSON.parse(fs.read-file-sync 'test/sample/random-c7-j100.result.json' .toString!)
    assert.deep-strict-equal output, answer

describe 'output for sample dataset', ->
  that "dataset random-c7-j100", ->
    input = fs.read-file-sync 'test/sample/random-c7-j100.csv'
      .toString!
      .split \\n
      .map (d,i) -> d.split(\,)
    output = schulze.fromArray input, {isRowBased: false, higher-is-better: false, show-warning: false}
    answer = JSON.parse(fs.read-file-sync 'test/sample/random-c7-j100.result.json' .toString!)
    assert.deep-strict-equal output, answer

  that "dataset wiki-example", ->
    json = fs.read-file-sync "test/sample/wiki-example.csv"
      .toString!
      .split \\n
      .map -> it.split \,
    output = schulze.fromArray json, {isRowBased: false, higher-is-better: false, show-warning: false}
    answer = JSON.parse(fs.read-file-sync 'test/sample/wiki-example.result.json' .toString!)
    assert.deep-strict-equal output, answer

  that "dataset random-c32-j10", ->
    output = schulze.fromCsv(
      fs.read-file-sync('test/sample/random-c32-j10.csv').toString!
      {isRowBased: false, higher-is-better: false, show-warning: false}
    )
    answer = fs.read-file-sync 'test/sample/random-c32-j10.result.data' .toString!
    output = output.pairPreferenceMatrix.byRank
        .map (p,j) ->
          p
            .map (d,i) -> if i == j + 1 => '-' else if i > 0 => d else (d.name + " " * (4 - d.name.length))
            .join(' ')
        .join(\\n)
    assert.deep-strict-equal output, answer
