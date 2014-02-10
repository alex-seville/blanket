var path = require('path')
var childProcess = require('child_process')
var phantomjs = require('phantomjs')
var binPath = phantomjs.path

var integrationTests = {

    run: function(callback, coverage, threshold){

        var runScript = path.join(__dirname, coverage ?
                            '../../src/reporters/travis-cov/phantom_runner.js' :
                            '../helpers/phantom_qunit_runner.js');

        //Run QUnit tests

        console.log("Running QUnit integration tests with" + 
                        (coverage ? ' ' : 'out ') +
                        'coverage.');

        var childArgs = [
          runScript,
          this._qunit_tests()
        ];

        if (coverage && typeof threshold !== 'undefined'){
            childArgs.push(threshold);
        }

        childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
          // handle results
          
          if (err || stderr){
            console.log(err+stderr);
          }else{
            console.log(stdout);
            callback();
          }
        });
    },
    _qunit_tests: function(){
        //QUnit test runner path
        return path.join(__dirname, './qunit/runner.html');
    }
};

module.exports = integrationTests;

