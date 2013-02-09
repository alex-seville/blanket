# Blanket.js

A seamless JavaScript code coverage library.

[Project home page](http://migrii.github.com/blanket/)
[Blanket_js on Twitter](http://www.twitter.com/blanket_js) for updates and news.

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

**NOTE:** Blanket.js will throw XHR cross domain errors if run with the file:// protocol.  See [Special Features Guide](https://github.com/Migrii/blanket/blob/master/docs/special_features.md) for more details and workarounds.


## Getting Started

Please see the following guides for using Blanket.js:

**Browser**
* [Getting Started](https://github.com/Migrii/blanket/blob/master/docs/getting_started_browser.md) (Basic QUnit usage)
* [Intermediate](https://github.com/Migrii/blanket/blob/master/docs/intermediate_browser.md) (Other test runners, global options)
* [Advanced](https://github.com/Migrii/blanket/blob/master/docs/advanced_browser.md) (writing your own reporters/adapters)
* [Special Features Guide](https://github.com/Migrii/blanket/blob/master/docs/special_features.md)

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

Feel free to add questions to the Issue tracker, or send them to [@blanket_js](http://www.twitter.com/blanket_js).


## Contributors

Thanks to the following people:

* [alex-seville](https://github.com/alex-seville)
* [dervalp](https://github.com/dervalp)
* [morkai](https://github.com/morkai)
* [msaglietto](https://github.com/msaglietto)
* [adambiggs](https://github.com/adambiggs)
* [ashwinr](https://github.com/ashwinr)
* [provegard](https://github.com/provegard)
* [orient-man](https://github.com/orient-man)
* [tmrudick](https://github.com/tmrudick)
* [wpreul](https://github.com/wpreul)
* [xzyfer](https://github.com/xzyfer)
* [flrent](https://github.com/flrent)

And thanks also to: [RequireJS](http://requirejs.org/), [Esprima](http://esprima.org/), [node-falafel](https://github.com/substack/node-falafel), [Mocha](http://visionmedia.github.com/mocha/), [Qunit](http://qunitjs.com/).


## Revision History

Feb 8-13 - 1.0.5
Node version will avoid instrumenting anything not in the current directory using `onlyCwd: true` in the package.json file.

Feb 7-13 - 1.0.4
Node version can use the same input attributes as client side version, branchTracking reporting for client, use string, regex or array as filter for node, loading issue fixes for requirejs+blanket.

Jan 23-13 - 1.0.3
Dependencies fixed for node. Various other fixes.

Jan 13-13 - 1.0.2
Branch tracking, Jasmine/RequireJS compatibility fixes, data-cover-never, data-cover-timeout attributes added, fixed bug in mocha adapter, fixed instrumentation of labelled statements, local uploader to deal with CORS issues.

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
