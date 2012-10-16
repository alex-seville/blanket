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
        runner = this.data.testrunners,
        filepaths = grunt.file.expand(root),
        done = this.async(),
        doneCount=0,
        rootPath,
        fileName,
        testfileContent,
        syncCount = filepaths.length+runner.length;
    
    var doneProcessing = function(){
        doneCount++;
        if (doneCount == syncCount){
          done(true);
        }
    };
    for(var i=0; i<filepaths.length; i++){
      fileName = filepaths[i];
      rootPath = path.dirname(fileName);
      testfileContent = grunt.file.read(fileName);
      grunt.helper('blanket-instrument', testfileContent, fileName,rootPath, dest, doneProcessing);
    }
    if (runner){
      for(var j=0;j<runner.length;j++){
        runnerContent = grunt.file.read(runner[j]);
        grunt.helper('blanket-remap',this.target, runner[j],runnerContent,doneProcessing);
      }
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

  grunt.registerHelper('blanket-remap', function(remapType,filename,content,callback) {
    
    blanket.remap({
      remapType: remapType,
      content: content
    },function(result){
      var fext = path.extname(filename);
      var newfext = "_instrumented"+fext;
      grunt.file.write(filename.replace(fext,newfext),result);
      callback();
    });
  });

};
