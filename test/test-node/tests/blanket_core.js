/*  core test to lib/blanket.js  */

var assert = require("assert"),
    blanketCore = require("../../../src/blanket").blanket,
    falafel = require("falafel"),
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


describe('test events', function(){
  describe('run through events', function(){
    it('should output correct stats', function(done){
        var testReporter = function(result){
          assert.equal(result.instrumentation,"blanket");
          done();
        };
        blanketCore.options("reporter",testReporter);
        blanketCore.setupCoverage();
        blanketCore.onModuleStart();
        blanketCore.onTestStart();
        blanketCore.onTestDone();
        blanketCore.onTestsDone();
    });
  });
 });

 
