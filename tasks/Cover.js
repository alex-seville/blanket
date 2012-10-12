/*
 * grunt-Cover
 * https://github.com/Migrii/jsCover
 *
 * Copyright (c) 2012 Alex-Seville
 * Licensed under the MIT license.
 */

 var fs = require('fs');

module.exports = function(grunt) {

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/gruntjs/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerTask('Cover', 'Your task description goes here.', function() {
    var inputfile = "var example='this';\nalert(example);";

    grunt.log.write(grunt.helper('Instrument',inputfile));
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('Instrument', function(input) {
    //parse the input file by line
    //replace with proper file parsing
    var lines = input.split("\n");
    grunt.log.write("if (!_$jscover) { _$jscover = {}; }\n");
    for (var i=0;i<lines.length;i++){
      grunt.log.write("_$jscover['example.js']["+i+"]++;\n");
      grunt.log.write(lines[i]+"\n");
    }

  });

};
