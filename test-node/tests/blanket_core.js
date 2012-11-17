/*  core test to lib/blanket.js  */

var assert = require("assert");
var blanketCore = require("../../lib/blanket").blanket;


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
            var source = "//this is test source\nvar test='1234';\n";
              source += "//comment\nconsole.log(test);";

            var expectedSource= [
                "//this is test source",
                "var test=\\'1234\\';",
                "//comment",
                "console.log(test);"
                ].join("',\n'");

            var result = blanketCore._prepareSource(source);
            assert.equal(result,expectedSource);
        });
    });
});