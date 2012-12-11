/*  core test to lib/blanket.js  */

var assert = require("assert"),
    blanketCore = require("../../src/blanket").blanket,
    falafel = require("../../src/lib/falafel").falafel,
    core_fixtures = require("../fixture/core_fixtures");


function normalizeWhitespace(str) {
  return str.replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .replace(/\s+\n/g, '\n')
            .replace(/\n\s+/g, '\n');
}

function assertString(actual, expected) {
  assert.equal(normalizeWhitespace(actual), normalizeWhitespace(expected));
}

describe('tracking', function(){
    
    describe('tracking setup', function(){
        it('should return tracking setup', function(){
            var expectedSource = "if (typeof _$jscoverage === 'undefined') _$jscoverage = {};\n";
              expectedSource += "if (typeof _$jscoverage['test.js'] === 'undefined'){_$jscoverage['test.js']=[];\n";
              expectedSource += "_$jscoverage['test.js'].source=['var test=\'1234\';',\n";
              expectedSource += "'//comment',\n";
              expectedSource += "'console.log(test);'];\n";
              expectedSource += "}";
            var filename = "test.js";
            var sourceArray = [
                "var test='1234';",
                "//comment",
                "console.log(test);"
                ];

            var result = blanketCore._trackingSetup(filename,sourceArray);
            assertString(result,expectedSource);
        });
    });
    describe('source setup', function(){
        it('should return source setup', function(){
            var source = core_fixtures.simple_test_file_js;

            var expectedSource= [
                "//this is test source",
                "var test=\\'1234\\';",
                "if (test === \\'1234\\')",
                "  console.log(true);",
                "//comment",
                "console.log(test);"
                ];

            var result = blanketCore._prepareSource(source);
            assertString(result.toString(),expectedSource.toString());
        });
    });
    describe('add tracking', function(){
        it('should add tracking lines', function(){
            
            var result = falafel(
                  core_fixtures.simple_test_file_js,
                  {loc:true,comment:true},
                  blanketCore._addTracking,"simple_test_file.js" );
            assertString(result.toString(),
                core_fixtures.simple_test_file_instrumented_js);
            
        });
    });
    
    describe('detect single line ifs', function(){
        it('should wrap with block statement', function(){
            
            var result = falafel(
                  core_fixtures.blockinjection_test_file_js,
                  {loc:true,comment:true},
                  blanketCore._addTracking,"blockinjection_test_file.js" );
            
            assertString(result.toString(),
                core_fixtures.blockinjection_test_file_instrumented_js);
            
        });
    });
});


describe('blanket instrument', function(){
  describe('instrument file', function(){
    it('should return instrumented file', function(done){
        blanketCore.instrument({
          inputFile: core_fixtures.simple_test_file_js,
          inputFileName: "simple_test_file.js"
        },function(result){
          assertString(result,
            core_fixtures.simple_test_file_instrumented_full_js);
          done();
        });
    });
  });
  
  describe('instrument tricky if block', function(){
    it('should return properly instrumented string', function(done){
        var expected = 4;
        var infile = "var a=3;if(a==1)a=2;else if(a==3){a="+expected+";}result=a;";
        var infilename= "testfile2";

        blanketCore.instrument({
          inputFile: infile,
          inputFileName: infilename
        },function(result){
          assert.equal(eval("(function test(){"+result+" return result;})()"),expected);
          done();
        });
    });
  });
});

describe('blanket getters/setters', function(){
  describe('filter getter/setter', function(){
    it('should get, then set, then get a filter', function(){
        assert.equal(blanketCore.getFilter(),null);
        blanketCore.setFilter("some data");
        assert.equal(blanketCore.getFilter(),"some data");
        blanketCore.setFilter(["some data"]);
        assert.equal(blanketCore.getFilter() instanceof Array,true);
        blanketCore.setFilter(/regex/);
        assert.equal(blanketCore.getFilter() instanceof RegExp,true);
    });
  });
  describe('existingRequirejs getter/setter', function(){
    it('should get, then set, then get a filter', function(){
        assert.equal(blanketCore.getExistingRequirejs(),false);
        blanketCore.setExistingRequirejs(true);
        assert.equal(blanketCore.getExistingRequirejs(),true);
        blanketCore.setExistingRequirejs(false);
        assert.equal(blanketCore.getExistingRequirejs(),false);
    });
  });
  describe('reporter getter/setter', function(){
    it('should get, then set, then get a reporter', function(){
        assert.equal(blanketCore.getReporter(),undefined);
        blanketCore.setReporter("expected");
        assert.equal(blanketCore.getReporter(),"expected");
        blanketCore.setReporter("other expected");
        assert.equal(blanketCore.getReporter(),"other expected");
        //teardown should handle this
        assert.equal(blanketCore.setReporter(),undefined);
    });
  });
});


describe('test events', function(){
  describe('run through events', function(){
    it('should output correct stats', function(done){
        var testReporter = function(result){
          assert.equal(result.instrumentation,"blanket");
          done();
        };
        blanketCore.setReporter(testReporter);
        blanketCore.setupCoverage();
        blanketCore.testEvents.onModuleStart();
        blanketCore.testEvents.onTestStart();
        blanketCore.testEvents.onTestDone();
        blanketCore.testEvents.onTestsDone();
    });
  });
 });
 //This should be moved to a browser test
  /*
  describe('setup test runner', function(){
    it('should succeed without coverage', function(done){
  
        blanketCore.testEvents.beforeStartTestRunner({
          callback: function(){
            done();
          },
          coverage: false
        });
    });
    
  });
  describe('setup test runner with requirejs', function(){
    it('should succeed without coverage', function(){
        blanketCore.setExistingRequirejs(true);
        blanketCore.testEvents.beforeStartTestRunner();
    });
    
  });

});


describe('blanket adapters', function(){
  describe('setting adapter', function(){
    it('should making a request and load the adapter file', function(done){
        var expected = "test adapter";
        var step=0;
        global.XMLHttpRequest = function(){
          return {
            open: function(verb,adapter,sync){
              assert.equal(verb,"GET");
              assert.equal(adapter,expected);
              assert.equal(sync,false);
              assert.equal(step,0);
              step++;
            },
            send: function(){
              assert.equal(step,1);
              done();
            },
            responseText: ";"
          };
        };
        assert.equal(blanketCore.hasAdapter(),false);
        blanketCore.setAdapter(expected);
        assert.equal(blanketCore.hasAdapter(),true);
        //deproxy
        global.XMLHttpRequest = null;
        delete global.XMLHttpRequest;
    });
  });
});
*/
