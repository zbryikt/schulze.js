require! <[fs ../src/schulze assert]>

that = it

describe 'output for sample dataset', ->
  that "dataset random-7-100", ->
    input = fs.read-file-sync 'test/sample/random-7-100.csv'
      .toString!
      .split \\n
      .map (d,i) -> [i] ++ d.split(\,)
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
