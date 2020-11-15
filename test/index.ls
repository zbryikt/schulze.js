require! <[fs ../src/schulze assert]>

that = it

describe 'output format', ->
  that "toCsv ( with simple dataset )", ->
    output = schulze.from-json(
      fs.read-file-sync('dataset/simple/dataset.json').toString!
      {higher-is-better: false, show-warning: false}
    )
    ret = schulze.toCsv output.candidates
    assert.equal ret, fs.read-file-sync('dataset/simple/answer.csv').toString!, new Error("output mismatch")
  that "toGrid ( with rand-c7-j100 dataset )", ->
    output = schulze.fromCsv(
      fs.read-file-sync('dataset/rand-c7-j100/dataset.csv').toString!
      {isRowBased: false, higher-is-better: false, show-warning: false}
    )
    ret = schulze.to-grid output, {byIndex: false} .trim!
    assert.equal(
      ret,
      fs.read-file-sync('dataset/rand-c7-j100/grid.txt').toString!trim!,
      new Error("output mismatch")
    )

describe 'different input sourec', ->
  that "fromJson ( with simple dataset )", ->
    output = schulze.from-json(
      fs.read-file-sync('dataset/simple/dataset.json').toString!
      {higher-is-better: false, show-warning: false}
    )
    answer = JSON.parse(fs.read-file-sync 'dataset/simple/answer.json' .toString!)
    assert.deep-strict-equal output, answer, new Error("output mismatch")

  that "fromCsv ( with rand-c7-j100 dataset )", ->
    output = schulze.fromCsv(
      fs.read-file-sync('dataset/rand-c7-j100/dataset.csv').toString!
      {isRowBased: false, higher-is-better: false, show-warning: false}
    )
    answer = JSON.parse(fs.read-file-sync 'dataset/rand-c7-j100/answer.json' .toString!)
    assert.deep-strict-equal output, answer, new Error("output mismatch")

describe 'output for sample dataset', ->
  that "dataset rand-c7-j100", ->
    output = schulze.fromCsv(
      (fs.read-file-sync 'dataset/rand-c7-j100/dataset.csv' .toString!),
      {isRowBased: false, higher-is-better: false, show-warning: false}
    )
    answer = JSON.parse(fs.read-file-sync 'dataset/rand-c7-j100/answer.json' .toString!)
    assert.deep-strict-equal output, answer, new Error("output mismatch (json)")
    grid = schulze.to-grid output, {byIndex: false} .trim!
    answer = fs.read-file-sync 'dataset/rand-c7-j100/grid.txt' .toString!trim!
    assert.deep-strict-equal grid, answer, new Error("output mismatch (grid)")

  that "dataset wiki-schulze-method", ->
    json = fs.read-file-sync "dataset/wiki-schulze-method/dataset.csv"
      .toString!
      .split \\n
      .map -> it.split \,
    output = schulze.fromArray json, {isRowBased: false, higher-is-better: false, show-warning: false}
    answer = JSON.parse(fs.read-file-sync 'dataset/wiki-schulze-method/answer.json' .toString!)
    assert.deep-strict-equal output, answer, new Error("output mismatch")

  that "dataset rand-c5-j5", ->
    output = schulze.fromCsv(
      fs.read-file-sync('dataset/rand-c5-j5/dataset.csv').toString!
      {isRowBased: false, higher-is-better: false, show-warning: false}
    )
    output = schulze.to-grid output, {byIndex: false}
    answer = fs.read-file-sync 'dataset/rand-c5-j5/answer.txt' .toString!
    assert.deep-strict-equal output, answer, new Error("output mismatch")

  that "dataset rand-c32-j10", ->
    output = schulze.fromCsv(
      fs.read-file-sync('dataset/rand-c32-j10/dataset.csv').toString!
      {isRowBased: false, higher-is-better: false, show-warning: false}
    )
    grid = schulze.to-grid output, {byIndex: false} .trim!
    answer = fs.read-file-sync 'dataset/rand-c32-j10/answer.txt' .toString!trim!
    assert.deep-strict-equal grid, answer, new Error("output mismatch")
