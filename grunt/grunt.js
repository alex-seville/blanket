module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    blanket:{
      instrument: {
        src: 'example/src/**/*.js',
        dest: 'example/src-cov'
      }
    }
  });

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', 'blanket');

};
