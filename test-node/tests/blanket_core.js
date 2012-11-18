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
    
    describe('detect single line ifs', function(){
        it('should wrap with block statement', function(){
            
            var result = falafel(
                  core_fixtures.blockinjection_test_file_js,
                  {loc:true,comment:true},
                  blanketCore._addTracking,"blockinjection_test_file.js" );
            
            assert.equal(result.toString(),
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
          assert.equal(result,
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
