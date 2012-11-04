var blanket = require("./lib-blanket")("source"),
    assert = require("assert"),
    scrFile = require("./source");


describe('easy test', function(){
  describe('simplest', function(){
    it('should return true when called', function(){
      assert.equal(scrFile(), true);
      
    });
  });
});