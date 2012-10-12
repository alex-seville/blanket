/*
 * grunt-Cover
 * https://github.com/Migrii/jsCover
 *
 * Copyright (c) 2012 Alex-Seville
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/gruntjs/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerTask('Cover', 'Your task description goes here.', function() {
    grunt.log.write(grunt.helper('Instrument'));
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('Instrument', function() {
    return 'Cover!!!';
  });

};
