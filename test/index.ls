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
      fs.read-file-sync('test/sample/random-7-100.csv').toString!
      {isRowBased: false, higher-is-better: false, show-warning: false}
    )
    answer = JSON.parse(fs.read-file-sync 'test/sample/random-7-100.result.json' .toString!)
    assert.deep-strict-equal output, answer

describe 'output for sample dataset', ->
  that "dataset random-7-100", ->
    input = fs.read-file-sync 'test/sample/random-7-100.csv'
      .toString!
      .split \\n
      .map (d,i) -> d.split(\,)
    output = schulze.fromArray input, {isRowBased: false, higher-is-better: false, show-warning: false}
    answer = JSON.parse(fs.read-file-sync 'test/sample/random-7-100.result.json' .toString!)
    assert.deep-strict-equal output, answer

  that "dataset wiki-example", ->
    json = fs.read-file-sync "test/sample/wiki-example.csv"
      .toString!
      .split \\n
      .map -> it.split \,
    output = schulze.fromArray json, {isRowBased: false, higher-is-better: false, show-warning: false}
    answer = JSON.parse(fs.read-file-sync 'test/sample/wiki-example.result.json' .toString!)
    assert.deep-strict-equal output, answer
