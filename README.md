# Blanket.js

A seamless JavaScript code coverage library.

[Project home page](http://migrii.github.com/blanket/)

[![Build Status](https://travis-ci.org/Migrii/blanket.png)](https://travis-ci.org/Migrii/blanket)

* [Getting Started](#getting-started)
* [Philosophy](#philosophy)
* [Mechanism](#mechanism)
* [Compatibility & Features List](#compatibility-and-features-list)
* [Roll Your Own](#roll-your-own)
* [Development](#development)
* [Contact](#contact)
* [Contributors](#contributors)  
* [Revision History](#revision-history)

**NOTE: Blanket.js will throw XHR cross domain errors if run with the file:// protocol.**  
The current workarounds are:
* [start Chrome with flags](http://askubuntu.com/questions/160245/making-google-chrome-option-allow-file-access-from-files-permanent)
* use a local server (testserver.js is included for this purpose)
* use a browser that supports cross domain local browser requests (some versions of FF, Safari).

You can also use the experimental loader (you will see a link to it when you try to run tests locally, if your browser supports it).  
When prompted, you select the folder containing (or) the source files you want instrumented and blanket will read the files and should proceed as usual.  
*The uploader is provided for demonstration purposes and is not an ideal way to operate unit testing*


## Getting Started

Please see the following guides for using Blanket.js:

**Browser**
* [Getting Started](https://github.com/Migrii/blanket/blob/master/docs/getting_started_browser.md) (Basic QUnit usage)
* [Intermediate](https://github.com/Migrii/blanket/blob/master/docs/intermediate_browser.md) (Other test runners, global options)
* [Advanced](https://github.com/Migrii/blanket/blob/master/docs/advanced_browser.md) (writing your own reporters/adapters)

**Node**
* [Getting Started](https://github.com/Migrii/blanket/blob/master/docs/getting_started_node.md) (basic mocha setup)
* [Intermediate](https://github.com/Migrii/blanket/blob/master/docs/intermediate_node.md) (mocha testrunner, travis-ci reporter)


## Philosophy

Blanket.js is a code coverage tool for javascript that aims to be:

1. Easy to install
2. Easy to use
3. Easy to understand

Blanket.js can be run seamlessly or can be customized for your needs.


## Mechanism

JavaScript code coverage compliments your existing JavaScript tests by adding code coverage statistics (which lines of your source code are covered by your tests).

Blanket works in a 3 step process:

1. Loading your source files using a modified [RequireJS](http://requirejs.org/)/[Require](http://nodejs.org/api/globals.html#globals_require) script
2. Parsing the code using [Esprima](http://esprima.org) and [node-falafel](https://github.com/substack/node-falafel), and instrumenting the file by adding code tracking lines.
3. Connecting to hooks in the test runner to output the coverage details after the tests have completed.


## Compatibility and Features List

See the [Compatiblity and Feature List](https://github.com/Migrii/blanket/blob/master/docs/compatibility_and_features.md) including links to working examples.


## Roll your own

1. `git clone git@github.com:Migrii/blanket.git`  
2. `npm install`  
3. Add your custom build details to the grunt.js file under `concat`
3. `grunt buildit` 

A minified and unminfied copy of the source can be created (see the `min` task).  


## Development

**All development takes place on the MASTER branch.**  
**Your pull request must pass all tests (run `npm test` to be sure) and respect all existing coverage thresholds**

If you're looking for a place to contribute, the ['low priority' issues](https://github.com/Migrii/blanket/issues?labels=low+priority&page=1&state=open) are probably a good introduction to the project.


## Contact

Feel free to add questions to the Issue tracker, or send them to [@alex_seville](http://www.twitter.com/alex_seville).


## Contributors

Thanks to the following people:

* [alex-seville](https://github.com/alex-seville)
* [dervalp](https://github.com/dervalp)
* [morkai](https://github.com/morkai)
* [msaglietto](https://github.com/msaglietto)
* [adambiggs](https://github.com/adambiggs)
* [ashwinr](https://github.com/ashwinr)
* [provegard](https://github.com/provegard)
* [flrent](https://github.com/flrent)

And thanks also to: [RequireJS](http://requirejs.org/), [Esprima](http://esprima.org/), [node-falafel](https://github.com/substack/node-falafel), [Mocha](http://visionmedia.github.com/mocha/), [Qunit](http://qunitjs.com/).


## Revision History

Dec 31-12 - 1.0.1
User guides, minification fixes, coffeescript/custom loader support for browser & node, replaced getters/setters with blanket.options.

Dec 14-12 - 1.0.0
Added to Bower, fixed relative paths issues, added noConflict, refactored core code, added Twitter Bootstrap example.

Dec-8-12 - 0.9.9
Moved Makefile into grunt and reorganized files.  Fixed instrumenting of comments in node.

Dec-3-12 - 0.9.8
Fixes to instrumentation, fix for escaped characters in node.  Added adapters and Jasmine example.

Nov-26-12 - 0.9.7
Custom reporters. Better organization of tests.

Nov-24-12 - 0.9.6
Better line counts, more tests, normalizing slashes for windows, require loader uses module._compile to properly pass the exports, added Makefile for CI, various other fixes. 

Nov-19-12 - 0.9.4
Major refactoring, QUnit tests run with phantomjs, both node and browser tests are covered by blanket on travis-ci.  Compatibility with existing requirejs instance.

Nov-8-12 - 0.9.2
Bug fixes to instrumentation and node require loader.

Nov-4-12 - 0.9.1
Works seamlessly with mocha (in node) and uses built in mocha reporters for coverage.

Oct-29-12 - 0.9.0
Initial release of blanket.js.  Works with qunit, but coverage output is not complete.

## License
Copyright (c) 2012 Alex-Seville  
Licensed under the MIT license.
