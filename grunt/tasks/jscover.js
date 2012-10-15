/*
 * grunt-
 * https://github.com/alex-seville/jsCover
 *
 * Copyright (c) 2012 alex-seville
 * Licensed under the MIT license.
 */

 var jsCover = require("../../lib/jsCover");

module.exports = function(grunt) {

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerTask('jscover', 'code coverage', function() {
    var testFile = "var t='test';\nif (t !== 'test'){\n t='bob';\n}\nconsole.log(t);";
    var instrumentedFile = grunt.helper('jscover-instrument',testFile);
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('jscover-instrument', function(infile) {
    return jsCover.instrument({
      
    })
  });

};
