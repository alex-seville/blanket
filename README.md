# Blanket.js

A seamless JavaScript code coverage library.

[Project home page](http://migrii.github.com/blanket/)

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
**Mocha**: [blanket.js for Mocha](https://raw.github.com/Migrii/blanket/live/dist/mocha/blanket.js)   

Or build it yourself by cloning the git repo, and then running `node builder.js <runner>` in /lib.  

Reference the script in your test runner.  
**QUnit**:   `<script src="blanket.js"></script>`  
**Mocha**:   `require("path/to/blanket");`  *Note: This require statement <strong>must</strong> be placed before the require statement of any scripts that you want covered.*  

## Configure

**QUnit**: Add the data attribute `data-cover` to any script file you want covered.   
(Ex: `<script src="mylibrary.js data-cover></script>` )  
**Mocha**: No additional configuration required.

## Use

**QUnit**: Run the tests (with the 'Enable Coverage' box checked) and you'll see the coverage statistics appended below the test results.
**Mocha**: Use the built-in reporters to output coverage details, i.e. `mocha -R html-cov > coverage.html`  


## Disclaimer

This product is currently in beta release and is NOT stable or production ready.  It is subject to changes.  We appreciate any feedback or assistance.

## Documentation
_(Coming soon)_

## Revision History

Nov-4-12 - 0.9.1
Works seamlessly with mocha (in node) and uses built in mocha reporters for coverage.

Oct-29-12 - 0.9.0
Initial release of blanket.js.  Works with qunit, but coverage output is not complete.

## License
Copyright (c) 2012 Alex-Seville  
Licensed under the MIT license.
