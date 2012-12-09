module.exports = function(grunt) {

  var version = grunt.file.readJSON("package.json").version;

  // ==========================================================================
  // BLANKET BUILD TASK
  // ==========================================================================

  grunt.registerMultiTask('build', 'Build blanket.', function() {
    var template = grunt.file.expandFiles(this.file.src);
    var options = this.data.options;

    grunt.verbose.write("Creating version: "+options.version);
    var dist = grunt.helper('render', template,options);
    grunt.verbose.write("\nRendered template.\n");
    grunt.file.write(this.file.dest, dist);

    grunt.log.writeln('File "' + this.file.dest + '" created.');
  });

  grunt.registerHelper('render', function(file,options) {
    var template = grunt.file.read(file);
    grunt.verbose.write("\nTemplate:"+template+"\n");
    for(var filepath in options){
      options[filepath] =  grunt.file.read(options[filepath]);
    }
    options.version = version;
    grunt.verbose.write("\nOptions:"+options+"\n");
    return grunt.template.process(template, options);
  });

};