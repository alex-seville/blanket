var assert = require("assert"),
    Report = require("../lib/report");


describe('Report', function(){
  describe('when I instanciate', function(){
    it('should have a format function', function(done){
  		var report = new Report("qunit", "teoeotet");
  		done();
    });
  });
}); 