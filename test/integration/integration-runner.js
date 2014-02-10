var path = require('path')
var childProcess = require('child_process')
var phantomjs = require('phantomjs')
var binPath = phantomjs.path

var integrationTests = {

    run: function(){

        //Run QUnit tests
        var childArgs = [
          path.join(__dirname, '../helpers/phantom_qunit_runner.js'),
          this._qunit_tests()
        ]  

        childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
          // handle results
          
          if (err){
            throw new Error(err);
          }else{
            console.log(stdout);
          }
        });
    },
    _qunit_tests: function(){
        //QUnit test runner path
        return path.join(__dirname, './qunit/runner.html');
    }
};

module.exports = integrationTests;

