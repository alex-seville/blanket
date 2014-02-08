module.exports = function(grunt) {

  // ==========================================================================
  // BLANKET TEST TASK
  // ==========================================================================

  grunt.registerMultiTask('blanketTest', 'Run tests for blanket.', function() {
    var async = require('async');
    
    var testConfigs = grunt.file.readJSON("test/testconfigs.json");
    var data;
    var done = this.async();
    
    var testCommands = [];

    for(var test in this.data){
      //grunt.log.write("test:"+this.data[test]+"\n");
      //grunt.log.write("data:"+data+"\n");
      testCommands.push(this.data[test].toString());
    }
    
    async.eachSeries(testCommands, function(cmd, next) {
      var command = cmd.split(" ");

      grunt.verbose.write("\nRunning:"+command[0]+" "+command.slice(1).join(" ")+"\n");
      grunt.util.spawn({
        cmd: command[0],
        args: command.slice(1)
      }, function(err, result, code) {
        if (!err) {
          grunt.log.write(result+"\n");
        } else {
          grunt.log.write("\nError:"+result);
          done(false);
        }
        next();
      });
    }, done);
  });

};