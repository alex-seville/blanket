# Blanket.js

JavaScript code coverage in the browser, powered by [Istanbul](https://github.com/gotwarlost/istanbul).

[Project home page](http://blanketjs.org/)  
[Blanket_js on Twitter](http://www.twitter.com/blanket_js) for updates and news.

**NOTE: All Pull-Requests must be made into the `development` branch.**


[![Build Status](https://travis-ci.org/alex-seville/blanket.png)](https://travis-ci.org/alex-seville/blanket)

* [Getting Started](#getting-started)
* [Philosophy](#philosophy)
* [Mechanism](#mechanism)
* [Grunt-Blanket](#grunt-blanket)
* [Compatibility & Features List](#compatibility-and-features-list)
* [Roll Your Own](#roll-your-own)
* [Development](#development)
* [Contact](#contact)
* [Contributors](#contributors)  
* [Roadmap](#roadmap)
* [Revision History](#revision-history)

**NOTE:** Blanket.js will throw XHR cross domain errors if run with the file:// protocol.  See [Special Features Guide](https://github.com/alex-seville/blanket/blob/master/docs/special_features.md) for more details and workarounds.


## Getting Started

Please see the following guides for using Blanket.js:

* [Getting Started](https://github.com/alex-seville/blanket/blob/master/docs/getting_started_browser.md) (Basic QUnit usage)
* [Intermediate](https://github.com/alex-seville/blanket/blob/master/docs/intermediate_browser.md) (Other test runners, global options)
* [Advanced](https://github.com/alex-seville/blanket/blob/master/docs/advanced_browser.md) (writing your own reporters/adapters)
* [Special Features Guide](https://github.com/alex-seville/blanket/blob/master/docs/special_features.md)


## Philosophy

Blanket.js is a code coverage tool for javascript that aims to be:

1. Easy to install
2. Easy to use
3. Easy to understand

Blanket.js can be run seamlessly or can be customized for your needs.

Beginning at Version 2.0, Blanket acts as a browser-decorator for the Istanbul code coverage library.


## Mechanism

JavaScript code coverage compliments your existing JavaScript tests by adding code coverage statistics (which lines of your source code are covered by your tests).

Blanket works in a 3 step process:

1. Loading your source files
2. Parsing the code and instrumenting the file using Istanbul.
3. Connecting to hooks in the test runner to output the coverage details after the tests have completed.


## Compatibility and Features List

See the [Compatiblity and Feature List](https://github.com/alex-seville/blanket/blob/master/docs/compatibility_and_features.md) including links to working examples.


## Roll your own

1. `git clone git@github.com:alex-seville/blanket.git`  
2. `npm install`  
3. Add your custom build details to the grunt.js file under `concat`
3. `grunt buildit` 

A minified and unminfied copy of the source can be created (see the `min` task).  


## Development

**All development takes place on the `development` branch**  
**Your pull request must pass all tests (run `npm test` to be sure) and respect all existing coverage thresholds**


## Contact

Feel free to add questions to the Issue tracker, or send them to [@blanket_js](http://www.twitter.com/blanket_js).


## Contributors

Thanks to the [many people who have contributed](https://github.com/alex-seville/blanket/network/members) to the project.


## Revision History

Sep 1-13 - 2.0
Complete rewrite using Istanbul as the coverage library and focusing on browser coverage only.

May 1-13 - 1.1.4  
Loaded reverting for grunt-blanket, branch tracking reporter fixed, coverage on-the-go (displaying coverage results while a single page is being used).  
  
Apr 28-13 - 1.1.3
YUI support added with custom adapter (and some wrapping code).  CompoundJS support appears to be outside the scope of project.

... (see [full revision history](HISTORY.md))

## License
Copyright (c) 2012-2013 Alex Seville  
Licensed under the MIT license.
