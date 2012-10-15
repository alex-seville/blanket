/*
 * grunt-
 * https://github.com/alex-seville/jsCover
 *
 * Copyright (c) 2012 alex-seville
 * Licensed under the MIT license.
 */
 var blanket = require("../../lib/blanket");

module.exports = function(grunt) {
  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('blanket', 'code coverage', function() {
    var root = this.data.files,
        options = this.data.options || {},
        coverFolder,
        filepaths,
        done,
        fileName,
        testfileContent,
        instrumentedFile;

    root || grunt.fail.warn("you should profile a source for jsCoverage");

    coverFolder = options.folder || grunt.fail.warn("you should defined a folder");

    filepaths = grunt.file.expandFiles(root);

    done = this.async();

    for(var i=0; i<filepaths.length; i++){
      fileName = filepaths[i];
      testfileContent = grunt.file.read(fileName);
      instrumentedFile = grunt.helper('blanket-instrument', testfileContent, fileName, coverFolder, done);
    }

  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('blanket-instrument', function(content, filename, coverfolder, callback) {
    blanket.instrument({
      inputFile: content,
      inputFileName: filename
    }, function(result){
        var instrumentFullName = coverfolder + filename;
        
        grunt.file.write(instrumentFullName, result);

        callback();
    });
  });

};
