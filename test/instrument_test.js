var assert = require("assert"),
    jsCover = require("../lib/blanket");


describe('Instrument', function(){
  describe('simple test file', function(){
    it('should return instrumented test file', function(done){
      var notExpected = "var t='test';\nalert(t);";
      jsCover.instrument({
        inputFile: notExpected,
        inputFileName: "testFile.js"
      },function(result){
        assert.notEqual(notExpected.length,result.length);
        done();
      });
    });
  });
});