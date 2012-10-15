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
    
    var root,
        filepaths,
        testfile,
        instrumentedFile,
        file,
        done;

    console.log("running the awesome JsCover...")

    root = this.file.src;

    root || grunt.fail("you should profile a source for jsCoverage"); 

    filepaths = grunt.file.expandFiles(root);

    done = this.async();

    for(var i=0; i<filepaths.length; i++){
      file = filepaths[i];
      testFile = grunt.file.read(file);
      instrumentedFile = grunt.helper('blanket-instrument', testFile, file, root, done);
    }
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('blanket-instrument', function(infile, infilename, rootPath, callback) {
    blanket.instrument({
      inputFile: infile,
      inputFileName: infilename
    }, function(result){
        var inputFileNamewRootpath = rootPath;

        if (inputFileNamewRootpath.slice(inputFileNamewRootpath.length) == "/"){ //replace with regex
          inputFileNamewRootpath.length = inputFileNamewRootpath.length-1;
        }
        
        inputFileNamewRootpath += "-cov/";
        infilename.replace(rootPath, inputFileNamewRootpath);
        grunt.file.write(infilename, result);
        callback();
    });
  });

};
