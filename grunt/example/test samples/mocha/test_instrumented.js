var assert = require("assert"),
    testLib = require("../src-cov/testLibNode");

describe('mocha sample test', function(){
    it('should return 1', function(){
      assert.equal(1, testLib);
    });
});
console.log(_$blanket);