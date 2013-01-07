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
        blanketCore.options("branchTracking",true);
        blanketCore.instrument({
          inputFile: core_fixtures.branch_test_file_js,
          inputFileName: "branch_test_file"
        },function(result){
          assert.equal(core_fixtures.branch_test_file_instrumented_js,result);
          blanketCore.options("branchTracking",false);
          done();
        });
    });
    it('should instrument complex branches correctly', function(done){
        blanketCore.options("branchTracking",true);
        blanketCore.instrument({
          inputFile: core_fixtures.branch_complex_test_file_js,
          inputFileName: "branch_complex_test_file"
        },function(result){
          assert.equal(core_fixtures.branch_complex_test_file_instrumented_js,result);
          blanketCore.options("branchTracking",false);
          done();
        });
    });
});

describe('when a file is instrumented', function(){
  describe('if we run the code', function(){
    it('should output correct stats', function(done){
        blanketCore.options("branchTracking",true);
        blanketCore.instrument({
          inputFile: core_fixtures.branch_test_file_js,
          inputFileName: "branch_test_file2"
        },function(result){
          eval(result);
          BRANCHTEST(0,0,0);
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
          blanketCore.options("branchTracking",false);
          
          done();
        });
    });
  });
 });