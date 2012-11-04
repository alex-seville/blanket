var blanket = require("blanket")("sample");
var assert = require("assert");
var sampleTest = require("./sample");

describe('require test', function(){
    it('should be true', function(){
      assert.equal(sampleTest(), true);
    });
});