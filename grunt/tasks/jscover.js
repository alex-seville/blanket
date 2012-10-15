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

  grunt.registerMultiTask('jscover', 'code coverage', function() {
   

    var root = this.file.src;
    var filepaths = grunt.file.expandFiles(root);
    var testfile, instrumentedFile,file;
    var done = this.async();
    for(var i=0;i<filepaths.length;i++){
      file = filepaths[i];
      testFile = grunt.file.read(file);
      instrumentedFile = grunt.helper('jscover-instrument',testFile,file,root,done);
    }
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('jscover-instrument', function(infile,infilename,rootPath,callback) {
    jsCover.instrument({
        inputFile: infile,
       inputFileName: infilename
    },function(result){
        var newRootpath = rootPath;
        if (newRootpath.slice(newRootpath.length) == "/"){ //replace with regex
          newRootpath.length = newRootpath.length-1;
        }
        newRootpath += "-cov/";
        infilename.replace(rootPath,newRootpath);
        grunt.file.write(infilename, result);
        callback();
    });
  });

};
