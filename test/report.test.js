var assert = require("should"),
    Report = require("../lib/report");


describe('Report', function(){
  describe('when I instanciate', function(){
    it('should throw whe wrong parameters are passed', function(done){
  		(function() {
  			new Report("", "");
  		}).should.throw();
  		
  		done();
    });
    it('should throw whe wrong type are passed', function(done){
  		(function() {
  			new Report("feefef", "");
  		}).should.throw();
  		
  		done();
    });
    it('should work when correct type is passed', function(done){
  		
  		var types = ["qunit", "jasmine", "mocha"],
  			content = "mega supa content",
  			report;

  		types.forEach(function(element, index){
  			 report = new Report(element, content);	
  			 report.runner.should.eql(element);
  			 report.content.should.eql(content);
  		});

  		done();
    });
    //TODO, write better test with regex 
    describe('Given an instanciation', function(){
    	var content = "<html><head><script src='src/test.js'></script></head><body></body></html>",
    		qunitReport = new Report("qunit", content),
			jasmineReport = new Report("jasmine", content),
			mochaReport = new Report("mocha", content);

    	it('should throw whe wrong type are passed', function(done){
	  		qunitReport.format(function(remapped){
	  			remapped.length.should.eql(2698);
  				done();
	  		});
    	});
    	it('should throw whe wrong type are passed', function(done){
	  		jasmineReport.format(function(remapped){
	  			remapped.length.should.eql(2771);
  				done();
	  		});
    	});
    	it('should throw whe wrong type are passed', function(done){
	  		mochaReport.format(function(remapped){
  				done();
	  		});
    	});
    });
  });
}); 