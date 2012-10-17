module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    blanket:{
      qunit: {
        src: 'example/test samples/src/**/*.js',
        dest: 'example/test samples/src-cov',
        testrunners: ['example/test samples/qunit/runner.html']
      },
      mocha: {
        src: 'example/test samples/src/**/*.js',
        dest: 'example/test samples/src-cov',
        testrunners: ['example/test samples/mocha/test.js']
      },
      jasmine: {
        src: 'example/test samples/src/**/*.js',
        dest: 'example/test samples/src-cov',
        testrunners: ['example/test samples/jasmine/SpecRunner.html']
      }
    }
  });

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', 'blanket');

};
