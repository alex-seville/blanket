var assert = require("assert"),
    testLib = require("../src/testLibNode");

describe('mocha sample test', function(){
    it('should return 1', function(){
      assert.equal(1, testLib);
    });
});