require! <[assert]>

that = it

describe \test, ->
  that "should be true", ->
    assert.equal 1, 1
