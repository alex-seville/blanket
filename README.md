# Blanket.js

A seamless JavaScript code coverage library.

[Project home page](http://migrii.github.com/blanket/)

[![Build Status](https://travis-ci.org/Migrii/blanket.png)](https://travis-ci.org/Migrii/blanket)

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

## Install

Download the appropriate version of blanket.js for your test runner:  
**QUnit**: [blanket.js for QUnit](https://raw.github.com/Migrii/blanket/live/dist/qunit/blanket.js)  
**Mocha**: `npm install blanket`     

Or [build it yourself](#roll-your-own).  

Reference the script in your test runner.  
**QUnit**:   `<script src="blanket.js"></script>`  
**Mocha**:   `require("blanket")(<pattern-for-source-files>);` The argument passed is a string (or regex) that refers to the folder where the source scripts are stored.  
*Note: This require statement <strong>must</strong> be placed before the require statement of any scripts that you want covered.*  

## Configure

**QUnit**: Add the data attribute `data-cover` to any script file you want covered.   
(Ex: `<script src="mylibrary.js data-cover></script>` )  
**Mocha**: No additional configuration required.

## Use

**QUnit**: Run the tests (with the 'Enable Coverage' box checked) and you'll see the coverage statistics appended below the test results.
**Mocha**: Use the built-in reporters to output coverage details, i.e. `mocha -R html-cov > coverage.html`  

## Continuous Integration

To integrate Blanket.js with an instance of Travis CI:

1. `npm install travis-cov`
2. Add to your package.json,  
   ```"scripts": { 
         "test": "mocha ./node_modules/.bin/mocha -R travis-cov"  
       },
       "travis-cov-threshold": <number>```   
3. When you commit your code to Travis the coverage results will be compared against the threshold and will fail if any files fall below the threshold.

## Roll your own

1. `git clone git@github.com:Migrii/blanket.git`  
2. `cd /blanket/lib`  
3. `node builder.js <runner>` where runner is qunit for browser based, and mocha for node based (for the moment).
4. Your newly rolled file can be found at `/dist/mocha/blanket.js` or `/dist/qunit/blanket.js`

Minification is built into the build script but is disabled for the time being.  
We plan on adding a variety of different command line options to allow you to create a version of blanket customized for your needs.  
Let us know what you'd like to see!

## Development

**All development takes place on the LIVE branch.  Ignore master, it is unused at the moment.**

## FAQ

See the [FAQ in the Blanket Wiki](https://github.com/Migrii/blanket/wiki/FAQ).

## Disclaimer

This product is currently in beta release and is NOT stable or production ready.  It is subject to changes.  We appreciate any feedback or assistance.

## Documentation
_(Coming soon)_

## Revision History

Nov-8-12 - 0.9.2
Bug fixes to instrumentation and node require loader.

Nov-4-12 - 0.9.1
Works seamlessly with mocha (in node) and uses built in mocha reporters for coverage.

Oct-29-12 - 0.9.0
Initial release of blanket.js.  Works with qunit, but coverage output is not complete.

## License
Copyright (c) 2012 Alex-Seville  
Licensed under the MIT license.
