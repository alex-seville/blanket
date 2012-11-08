var blanket = require("../../dist/mocha/blanket")("sample");
var assert = require("assert");
var sampleTest = require("./nested/nested_require.js")(0);

describe('require test', function(){
    it('should be true', function(){
      assert.equal(sampleTest(), true);
    });
});