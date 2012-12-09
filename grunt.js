module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    blanketTest: {
      normal:{
        node: "<%= cmds.mocha %> <%= runners.node %>",
        browser: "<%= cmds.phantom %> <%= phantom.qunit %> <%= runners.browser %>",
        browserRequire: "<%= cmds.phantom %> <%= phantom.qunit %> <%= runners.browserRequire %>",
        browserBackbone: "<%= cmds.phantom %> <%= phantom.qunit %> <%= runners.browserBackbone %>",
        browserReporter: "<%= cmds.phantom %> <%= phantom.qunit %> <%= runners.browserReporter %>",
        browserJasmine: "<%= cmds.phantom %> <%= phantom.jasmine %> <%= runners.browserJasmine %>",
        browserJasmineBuild: "<%= cmds.phantom %> <%= phantom.jasmine %> <%= runners.browserJasmineBuild %>",
        browserJasmineAdapter: "<%= cmds.phantom %> <%= phantom.jasmine %> <%= runners.browserJasmineAdapter %>",
        browserMochaAdapter: "<%= cmds.phantom %> <%= phantom.mocha %> <%= runners.browserMochaAdapter %>"
      },
      coverage:{
        node: "<%= cmds.mocha %> --reporter <%= reporters.mocha.node %> <%= runners.node %>",
        browser: "<%= cmds.phantom %> <%= reporters.qunit %> <%= runners.browser %> 80",
        browserRequire: "<%= cmds.phantom %> <%= reporters.qunit %> <%= runners.browserRequire %> 80",
        browserBackbone: "<%= cmds.phantom %> <%= reporters.qunit %> <%= runners.browserBackbone %> 10",
        browserReporter: "<%= cmds.phantom %> <%= reporters.qunit %> <%= runners.browserReporter %> 80",
        browserJasmine: "<%= cmds.phantom %> <%= reporters.jasmine %> <%= runners.browserJasmine %> 80",
        browserJasmineBuild: "<%= cmds.phantom %> <%= reporters.jasmine %> <%= runners.browserJasmineBuild %> 80",
        browserJasmineAdapter: "<%= cmds.phantom %> <%= reporters.jasmine %> <%= runners.browserJasmineAdapter %> 80",
        browserMochaAdapter: "<%= cmds.phantom %> <%= reporters.mocha.browser %> <%= runners.browserMochaAdapter %> 80"
      }
    },
    build: {
      qunit: {
        src: "build/qunit",
        dest: "dist/qunit/blanket.js",
        options: {
          noAutoRun: "src/qunit/noautorun.js",
          parser: "src/lib/esprima.js",
          falafel: "src/lib/falafel.js",
          requirejs: "src/lib/require.js",
          blanket: "src/blanket.js",
          reporter: "src/qunit/reporter.js",
          config: "src/config.js",
          blanketRequire: "src/blanketRequire.js",
          testHooks: "src/qunit/qunit.js"
        }
      },
      jasmine: {
        src: "build/jasmine",
        dest: "dist/jasmine/blanket_jasmine.js",
        options: {
          parser: "src/lib/esprima.js",
          falafel: "src/lib/falafel.js",
          requirejs: "src/lib/require.js",
          blanket: "src/blanket.js",
          reporter: "src/qunit/reporter.js",
          config: "src/config.js",
          blanketRequire: "src/blanketRequire.js",
          testHooks: "src/adapters/jasmine-blanket.js"
        }
      }
    },
    min: {
      qunit: {
        src: ['dist/qunit/blanket.js'],
        dest: 'dist/qunit/blanket.min.js'
      },
      jasmine: {
        src: ['dist/jasmine/blanket_jasmine.js'],
        dest: 'dist/jasmine/blanket_jasmine.min.js'
      }
    },
    lint: {
      files: [
      'grunt.js',
      'src/*.js',
      'src/qunit/*.js',
      'src/reporters/*.js',
      'src/adapters/*.js',
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
        immed: false,
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
        "evil":"ignore",
        expr: "warn"
      },
      globals: {}
    }
  });

  grunt.loadNpmTasks('grunt-contrib');
  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', 'lint');
  grunt.registerTask('buildit','lint build:qunit min:qunit');
  grunt.registerTask('blanket', 'build min blanketTest:normal');
  grunt.registerTask('blanket-coverage', 'build min blanketTest:coverage');

};
