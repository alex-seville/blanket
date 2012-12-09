# Blanket.js

A seamless JavaScript code coverage library.

[Project home page](http://migrii.github.com/blanket/)

[![Build Status](https://travis-ci.org/Migrii/blanket.png)](https://travis-ci.org/Migrii/blanket)

* [Philosophy](#philosophy)
* [Mechanism](#mechanism)
* [Install](#install)
* [Configure](#configure)
* [Use](#use)
* [Custom Reporters](#custom-reporters)
* [Continuous Integration](#continuous-integration)
* [Roll Your Own](#roll-your-own)
* [Development](#development)
* [FAQ](#faq)
* [Contributors](#contributors)  
* [Revision History](#revision-history)



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

**Mocha**: `npm install blanket` (NOTE: The Blanket NPM package requires Node 0.8.*)    

Or [build it yourself](#roll-your-own).  


## Configure

Reference the script in your test runner.

**QUnit**: `<script src="blanket.js"></script>`  
The add the data attribute `data-cover` to any script file you want covered.   
(Ex: `<script src="mylibrary.js data-cover></script>` )  

You can also use a global filter with the data-cover-only attribute:

`<script src="blanket.js" data-cover-only="/src/"></script>` or
`<script src="blanket.js" data-cover-only="['pattern1','pattern2']"></script>` or
`<script src="blanket.js" data-cover-only="//regex//"></script>`

**Mocha**: `require("blanket")(<pattern-for-source-files>);` The argument passed is a string (or regex) that refers to the folder where the source scripts are stored.  
*Note: This require statement <strong>must</strong> be placed before the require statement of any scripts that you want covered.*  

In the browser, you can also avoid using the data-cover attributes by using a string/regex to denote which files to load:  
`<script> blanket.loadOnly = "/src/"; </script>`  
This is useful in certain situations, and neccessary when your test runner uses requirejs to load your source files.

## Use

**QUnit**: Run the tests (with the 'Enable Coverage' box checked) and you'll see the coverage statistics appended below the test results.

**Mocha**: Use the built-in reporters to output coverage details, i.e. `mocha -R html-cov > coverage.html`  

## Custom Reporters

**QUnit**: Custom reporters can be created to match your prefered test runner style.  See [simple_json_reporter.js](https://github.com/Migrii/blanket/blob/live/src/reporters/simple_json_reporter.js) as an example.  More documentation soon.

Reference your reporter with the data-cover-reporter attribute:
`<script src="blanket.js" data-cover-reporter="myReporter.js"></script>`

**Mocha**: You can use any existing mocha reporters, or create your own.  See [json-cov](https://github.com/visionmedia/mocha/blob/master/lib/reporters/json-cov.js) as an example.

## Continuous Integration

You can use the [travis-cov](https://github.com/alex-seville/travis-cov) reporter, to integrate Blanket.js with an instance of Travis CI:

1. `npm install travis-cov`
2. Add to your package.json,  

```   
"scripts": {   
         "test": "mocha -R travis-cov"   
       },   
       "travis-cov-threshold": <number>  
```   

If your CI tests aren't run with mocha, but are instead run with qunit & phantomjs, you can use the following configuration:

```     
"scripts": {   
         "test": "phantomjs ./node_modules/travis-cov/phantom_runner.js path-to-your-testrunner <threshold-number>"   
       }  
```   

When you commit your code to Travis the coverage results will be compared against the threshold and will fail if any files fall below the threshold.

## Roll your own

1. `git clone git@github.com:Migrii/blanket.git`  
2. `npm install`  
3. `grunt buildit` 
4. Your newly rolled file can be found at `/dist/qunit/blanket.js`

A minified and unminfied copy of the source will be created.  
We plan on adding a variety of different command line options to allow you to create a version of blanket customized for your needs.  
Let us know what you'd like to see!

## Development

**All development takes place on the LIVE branch.  Ignore master, it is unused at the moment.**

If you're looking for a place to contribute, the ['low priority' issues](https://github.com/Migrii/blanket/issues?labels=low+priority&page=1&state=open) are probably a good introduction to the project.

## FAQ

See the [FAQ in the Blanket Wiki](https://github.com/Migrii/blanket/wiki/FAQ).

Feel free to add questions to the Issue tracker, or send them to [@alex_seville](http://www.twitter.com/alex_seville).


## Contributors

Thanks to the following people:

* [alex-seville](https://github.com/alex-seville)
* [dervalp](https://github.com/dervalp)
* [morkai](https://github.com/morkai)
* [msaglietto](https://github.com/msaglietto)
* [flrent](https://github.com/flrent)

And thanks also to: [RequireJS](http://requirejs.org/), [Esprima](http://esprima.org/), [node-falafel](https://github.com/substack/node-falafel), [Mocha](http://visionmedia.github.com/mocha/), [Qunit](http://qunitjs.com/).

## Disclaimer

This product is currently in beta release and is NOT stable or production ready.  It is subject to changes.  We appreciate any feedback or assistance.

## Revision History

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
