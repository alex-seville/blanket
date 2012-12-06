module.exports = function(grunt) {

  // ==========================================================================
  // BLANKET TEST TASK
  // ==========================================================================

  grunt.registerMultiTask('blanketTest', 'Run tests for blanket.', function() {
    var blanketTestConfigs = grunt.config(['blanketTest']);
    var tmp = blanketTestConfigs.tests;
    if (typeof tmp === 'object') {
      grunt.verbose.writeln('Using "' + this.target + '" blanketTest tests.');
    } else {
      grunt.log.writeln("error reading test configuration.");
      return false;
    }   

    //for each test we want to run a normal and a coverage mode
  });
};