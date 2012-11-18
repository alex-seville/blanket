/*  core test to lib/blanket.js  */

var assert = require("assert"),
    blanketCore = require("../../lib/blanket").blanket,
    falafel = require("../../lib/falafel").falafel,
    core_fixtures = require("../fixture/core_fixtures");

describe('tracking', function(){
    describe('tracking setup', function(){
        it('should return tracking setup', function(){
            var expectedSource = "if (typeof _$jscoverage === 'undefined') _$jscoverage = {};\n";
              expectedSource += "if (typeof _$jscoverage['test.js'] === 'undefined'){_$jscoverage['test.js']=[];\n";
              expectedSource += "_$jscoverage['test.js'].source=['var test=\'1234\';',\n";
              expectedSource += "'//comment',\n";
              expectedSource += "'console.log(test);'];\n";
              expectedSource += "_$jscoverage['test.js'][1]=0;\n";
              expectedSource += "_$jscoverage['test.js'][2]=0;\n";
              expectedSource += "_$jscoverage['test.js'][3]=0;\n";
              expectedSource += "}";
            var filename = "test.js";
            var sourceArray = [
                "var test='1234';",
                "//comment",
                "console.log(test);"
                ];

            var result = blanketCore._trackingSetup(filename,sourceArray);
            assert.equal(result,expectedSource);
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
            assert.equal(result.toString(),expectedSource.toString());
        });
    });
    describe('add tracking', function(){
        it('should add tracking lines', function(){
            
            var result = falafel(
                  core_fixtures.simple_test_file_js,
                  {loc:true,comment:true},
                  blanketCore._addTracking,"simple_test_file.js" );
            assert.equal(result.toString(),
                core_fixtures.simple_test_file_instrumented_js);
            
        });
    });
});

describe('blanket test events', function(){
  describe('test events', function(){
    it('should create and report coverage data', function(){
      var blanketReportProxy = blanketCore.report;
      blanketCore.report = function(result){
        assert.equal(result.instrumentation,"blanket");
        assert.equal(result.stats.suites,1);
        assert.equal(result.stats.tests,1);
        assert.equal(result.stats.passes,1);
        assert.equal(result.stats.pending,0);
        assert.equal(result.stats.failures,0);
      };

      blanketCore.testEvents.testsStart();
      blanketCore.testEvents.suiteStart();
      blanketCore.testEvents.testStart();
      blanketCore.testEvents.testDone({
        passed: 1,
        total: 1
      });
      blanketCore.testEvents.testsDone();

      //return proxy
      blanketCore.report = blanketReportProxy;
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
              assert.equal(result,
                core_fixtures.simple_test_file_instrumented_full_js);
              done();
            });
        });
    });
});
