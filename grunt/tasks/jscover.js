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
    var testFilepath = "example/src/";
    var testFilename = "test.js";
    var testFile = grunt.file.read(testFilepath+testFilename);
    var instrumentedFile = grunt.helper('jscover-instrument',testFile,testFilepath,testFilename);
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('jscover-instrument', function(infile,infilepath,infilename) {
    jsCover.instrument({
        inputFile: infile,
       inputFileName: infilepath+infilename
    },function(result){
        grunt.file.write("example/src-cov/"+infilename, result);
    });
  });

};
