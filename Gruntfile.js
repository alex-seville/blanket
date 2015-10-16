module.exports = function(grunt) {
  'use strict';
  
  require('load-grunt-tasks')(grunt);
  
  var testConfig = grunt.file.readJSON("test/testconfigs.json");

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> */\n\n',
    cmds: testConfig.cmds,
    runners: testConfig.runners,
    phantom: testConfig.phantom,
    reporters: testConfig.reporters,
    blanketTest: {
      normal:{
        node: "<%= cmds.mocha %> <%= runners.node %>",
        nodeCS: "<%= cmds.mochaCS %> <%= runners.nodeCS %>",
        nodeCJSX: "<%= cmds.mochaCJSX %> <%= runners.nodeCJSX %>",
        browser: "<%= cmds.phantom %> <%= phantom.qunit %> <%= runners.browser %>",
        browserBranchTracking: "<%= cmds.phantom %> <%= phantom.qunit %> <%= runners.browserBranchTracking %>",
        browserRequire: "<%= cmds.phantom %> <%= phantom.qunit %> <%= runners.browserRequire %>",
        browserBackbone: "<%= cmds.phantom %> <%= phantom.qunit %> <%= runners.browserBackbone %>",
        browserReporter: "<%= cmds.phantom %> <%= phantom.qunit %> <%= runners.browserReporter %>",
        browserJasmine: "<%= cmds.phantom %> <%= phantom.jasmine %> <%= runners.browserJasmine %>",
        browserJasmineBuild: "<%= cmds.phantom %> <%= phantom.jasmine %> <%= runners.browserJasmineBuild %>",
        browserJasmineAdapter: "<%= cmds.phantom %> <%= phantom.jasmine %> <%= runners.browserJasmineAdapter %>",
        browserJasmineAdapterArray: "<%= cmds.phantom %> <%= phantom.jasmine %> <%= runners.browserJasmineAdapterArray %>",
        browserJasmineAdapterRegex: "<%= cmds.phantom %> <%= phantom.jasmine %> <%= runners.browserJasmineAdapterRegex %>",
        browserMochaAdapter: "<%= cmds.phantom %> <%= phantom.mocha %> <%= runners.browserMochaAdapter %>",
        browserBootstrap: "<%= cmds.phantom %> <%= phantom.qunit_old %> <%= runners.browserBootstrap %>",
        browserCoffeeScript: "<%= cmds.phantom %> <%= phantom.qunit %> <%= runners.browserCoffeeScript %>",
        browserJasmineRequire: "<%= cmds.phantom %> <%= phantom.jasmine %> <%= runners.browserJasmineRequire %>",
        //browserChutzpah: "<%= cmds.phantom %> <%= phantom.qunit %> <%= runners.browserChutzpah %>",
        browserCommonjs: "<%= cmds.phantom %> <%= phantom.qunit %> <%= runners.browserCommonjs %>"
      },
      coverage:{
        node: "<%= cmds.mocha %> --reporter <%= reporters.mocha.node %> <%= runners.node %>",
        browser: "<%= cmds.phantom %> <%= reporters.qunit %> <%= runners.browser %> 80",
        browserBranchTracking: "<%= cmds.phantom %> <%= phantom.qunit %> <%= runners.browserBranchTracking %> 80",
        browserRequire: "<%= cmds.phantom %> <%= reporters.qunit %> <%= runners.browserRequire %> 80",
        browserReporter: "<%= cmds.phantom %> <%= reporters.qunit %> <%= runners.browserReporter %> 80",
        browserJasmine: "<%= cmds.phantom %> <%= reporters.jasmine %> <%= runners.browserJasmine %> 80",
        browserJasmineBuild: "<%= cmds.phantom %> <%= reporters.jasmine %> <%= runners.browserJasmineBuild %> 80",
        browserJasmineAdapter: "<%= cmds.phantom %> <%= reporters.jasmine %> <%= runners.browserJasmineAdapter %> 80",
        browserMochaAdapter: "<%= cmds.phantom %> <%= reporters.mocha.browser %> <%= runners.browserMochaAdapter %> 80"
      }
    },
    concat: {
      acorn: {
        options: {
          banner: '(function(define){\n',
          footer: '\n})(null);<%= "" %>'
        },
        src: ['node_modules/acorn/dist/acorn.js'],
        dest: '.tmp/acorn.js'
      },
      isArguments: {
        options: {
          banner: '(function(module){\n',
          footer: '\nwindow.isArguments = module.exports;\n})({exports: {}});'
        },
        src: ['node_modules/object-keys/isArguments.js'],
        dest: '.tmp/isArguments.js'
      },
      forEach: {
        options: {
          banner: '(function(module){\n',
          footer: '\nwindow.forEach = module.exports;\n})({exports: {}});'
        },
        src: ['node_modules/foreach/index.js'],
        dest: '.tmp/forEach.js'
      },
      isArray: {
        options: {
          banner: '(function(module){\n',
          footer: '\nwindow.isArray = module.exports;\n})({exports: {}});'
        },
        src: ['node_modules/isarray/index.js'],
        dest: '.tmp/isarray.js'
      },
      objectKeys: {
        options: {
          banner: '(function(require,module){\n',
          footer: '\nwindow.objectKeys =  module.exports;\n})(function(){return isArguments;},{exports: {}});'
        },
        src: ['node_modules/object-keys/index.js'],
        dest: '.tmp/object-keys.js'
      },
      falafel: {
        options: {
          banner: '/*!\n' +
                  ' * falafel (c) James Halliday / MIT License\n' +
                  ' * https://github.com/substack/node-falafel\n' +
                  ' */\n\n' +
                  '(function(require,module){\n',
          footer: '\nwindow.falafel = module.exports;})(function(moduleName){switch(moduleName){case "acorn":\nreturn {parse: acorn.parse};\ncase "object-keys":\nreturn objectKeys;\ncase "foreach":\nreturn forEach;\ncase "isarray":\nreturn isArray;}},{exports: {}});'
        },
        src: ['node_modules/falafel/index.js'],
        dest: '.tmp/falafel.js'
      },
      qunit: {
        options: {
          banner: '<%= banner %>'
        },
        src: [
          'src/qunit/noautorun.js',
          '<%= concat.acorn.dest %>',
          '<%= concat.isArguments.dest %>',
          '<%= concat.forEach.dest %>',
          '<%= concat.isArray.dest %>',
          '<%= concat.objectKeys.dest %>',
          '<%= concat.falafel.dest %>',
          'src/blanket.js',
          'src/blanket_browser.js',
          "src/qunit/reporter.js",
          "src/config.js",
          "src/blanketRequire.js",
          "src/qunit/qunit.js"
        ],
        dest: 'dist/qunit/blanket.js'
      },
      jasmine: {
        options: {
          banner: '<%= banner %>'
        },
        src: [
          '<%= concat.acorn.dest %>',
          '<%= concat.isArguments.dest %>',
          '<%= concat.forEach.dest %>',
          '<%= concat.isArray.dest %>',
          '<%= concat.objectKeys.dest %>',
          '<%= concat.falafel.dest %>',
          'src/blanket.js',
          'src/blanket_browser.js',
          'src/qunit/reporter.js',
          'src/config.js',
          "src/blanketRequire.js",
          "src/adapters/jasmine-blanket.js"
          ],
        dest: 'dist/jasmine/blanket_jasmine.js'
      },
      mocha: {
        options: {
          banner: '<%= banner %>'
        },
        src: [
          '<%= concat.acorn.dest %>',
          '<%= concat.isArguments.dest %>',
          '<%= concat.forEach.dest %>',
          '<%= concat.isArray.dest %>',
          '<%= concat.objectKeys.dest %>',
          '<%= concat.falafel.dest %>',
          'src/blanket.js',
          'src/blanket_browser.js',
          "src/qunit/reporter.js",
          "src/config.js",
          "src/blanketRequire.js",
          "src/adapters/mocha-blanket.js"
        ],
        dest: 'dist/mocha/blanket_mocha.js'
      }
    },
    uglify: {
      options: {
        preserveComments: require('uglify-save-license'),
        beautify: {
          ascii_only: true
        }
      },
      qunit: {
        src: ['dist/qunit/blanket.js'],
        dest: 'dist/qunit/blanket.min.js'
      },
      jasmine: {
        src: ['dist/jasmine/blanket_jasmine.js'],
        dest: 'dist/jasmine/blanket_jasmine.min.js'
      },
      mocha: {
        src: ['dist/mocha/blanket_mocha.js'],
        dest: 'dist/mocha/blanket_mocha.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        trailing: true,
        eqeqeq: true,
        immed: false,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: false,
        boss: true,
        strict:false,
        eqnull: true,
        node: true,
        browser: true,
        expr: "warn"
      },
      all: [
        'Gruntfile.js',
        'src/*.js',
        'src/qunit/*.js',
        'src/reporters/*.js',
        'src/adapters/*.js',
        'src/loaders/*.js',
        'test/*.js',
        'test-node/*.js'
      ]
    },
    clean: {
      tmpfiles: ['./.tmp']
    },
    watch: {
      files: '<%= jshint.all %>',
      tasks: 'default'
    }
  });

  // Load local tasks.
  grunt.loadTasks('tasks');

  grunt.registerTask('build',['jshint', 'concat', 'uglify', 'clean']);
  grunt.registerTask('default', ['build', 'blanketTest']);
  grunt.registerTask('blanket', ['build', 'blanketTest:normal']);
  grunt.registerTask('blanket-coverage', ['build', 'blanketTest:coverage']);
};
