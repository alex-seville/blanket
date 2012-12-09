var core_fixtures = require("../fixture/core_fixtures");

var assert = require("assert"),
    blanketCore = require("../../src/blanket").blanket;


describe('when instrumenting a file', function(){
    it('should instrument comments correctly', function(done){
        blanketCore.instrument({
          inputFile: core_fixtures.comment_test_file_js,
          inputFileName: "comment_test_file"
        },function(result){
          assert.equal(core_fixtures.comment_test_file_instrumented_js,result);
          done();
        });
    });
});