module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    blanketTest: {
      tests:{
        node: "test-node/testrunner.js",
        browser :"test/lib-tests/runner.html",
        browserRequire :"test/requirejs/require_runner.html",
        browserBackbone :"test/backbone-koans/index.html?coverage=true",
        browserReporter :"test/custom-reporter/index.html?coverage=true",
        browserJasmine :"test/jasmine/SpecRunner.html",
        browserJasmineAdapter :"test/jasmine/SpecRunner_data_adapter.html",
        browserMochaAdapter :"test/mocha-browser/adapter.html"
      }
    },
    lint: {
      files: [
      'grunt.js',
      'lib/blanket.js',
      'lib/blanketRequire.js',
      'lib/config.js',
      'lib/index.js',
      'lib/jasmine.js',
      'lib/node.js',
      'lib/qunit.js',
      'lib/reporter.js',
      'lib/adapters/jasmine-blanket.js',
      'lib/adapters/mocha-blanket.js',
      'lib/reporters/simple_json_reporter.js',
      'test/*.js',
      'test-node/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: false,
        boss: true,
        eqnull: true,
        node: true,
        browser: true,
        es5: true,
        evil:false
      },
      globals: {}
    }
  });

  grunt.loadNpmTasks('grunt-contrib');
  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', 'lint blanketTest');

};
