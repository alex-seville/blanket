module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    blanket:{
      cover: {
        files: ['example/src/**/*.js'],
        options: {
          folder: "cover/"
        }
      }
    }
  });

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', 'blanket');

};
