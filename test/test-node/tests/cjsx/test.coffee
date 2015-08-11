React = require("react")
sampleTest = require("../../fixture/src/sampleCjsx.cjsx")
assert = require("assert")
describe "require test", ->
  it "should return div with 10", ->
    result = sampleTest()
    assert.equal 'div', result.type
    assert.equal 10, result.props.children