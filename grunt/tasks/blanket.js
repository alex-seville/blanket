/*
 * grunt-
 * https://github.com/alex-seville/jsCover
 *
 * Copyright (c) 2012 alex-seville
 * Licensed under the MIT license.
 */
 var blanket = require("../../lib/blanket");
 var path = require('path');

module.exports = function(grunt) {
  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('blanket', 'code coverage', function() {
    
    var root = this.data.src || grunt.fail.warn("you should profile a source for jsCoverage"),
        dest = this.data.dest || grunt.fail.warn("you need to define a dest folder"),
        filepaths = grunt.file.expand(root),
        done = this.async(),
        doneCount=0,
        rootPath,
        fileName,
        testfileContent,
        instrumentedFile;

    var doneProcessing = function(){
        doneCount++;
        if (doneCount == filepaths.length-1){
          done(true);
        }
    };

    for(var i=0; i<filepaths.length; i++){
      fileName = filepaths[i];
      rootPath = path.dirname(fileName);
      testfileContent = grunt.file.read(fileName);
      instrumentedFile = grunt.helper('blanket-instrument', testfileContent, fileName,rootPath, dest, doneProcessing);
    }

  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('blanket-instrument', function(content, filename,root, dest, callback) {
    blanket.instrument({
      inputFile: content,
      inputFileName: filename
    }, function(result){
        var instrumentFullName = filename.replace(root,dest);
        grunt.file.write(instrumentFullName, result);
        callback();
    });
  });

};
