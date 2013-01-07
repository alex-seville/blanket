var core_fixtures = require("../fixture/core_fixtures");

var assert = require("assert"),
    blanketCore = require("../../../src/blanket").blanket;


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
    it('should instrument branches correctly', function(done){
        blanketCore.instrument({
          inputFile: core_fixtures.branch_test_file_js,
          inputFileName: "branch_test_file"
        },function(result){
          assert.equal(core_fixtures.branch_test_file_instrumented_js,result);
          done();
        });
    });
});

describe('when a file is instrumented', function(){
  describe('if we run the code', function(){
    it('should output correct stats', function(done){
        blanketCore.instrument({
          inputFile: core_fixtures.branch_test_file_js,
          inputFileName: "branch_test_file2"
        },function(result){
          eval(result);
          BRANCHTEST(1);
          var fileResults = global._$jscoverage["branch_test_file2"];
          var branchResults = fileResults.branchData[2][7];
          assert.equal(branchResults.length > 0,true);
          var bothHit = (
            branchResults.some(function(item){
              return item;
            }) &&
            branchResults.some(function(item){
              return !item;
            })
          );
          assert.equal(bothHit,false,"both are hit.");
          BRANCHTEST(2);
          bothHit = (
            branchResults.some(function(item){
              return item;
            }) &&
            branchResults.some(function(item){
              return !item;
            })
          );
          assert.equal(bothHit,true,"both are not hit.");
          
          done();
        });
    });
  });
 });