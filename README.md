# blanket.js

seamless js code coverage

[home page](http://migrii.github.com/blanket/)

## Philosophy

Blanket.js is a code coverage tool for javascript that aims to be:

1. Easy to install
2. Easy to use
3. Easy to understand

Blanket.js can be run seamlessly or can be customized for your needs.

## Mechanism

JavaScript code coverage compliments your existing JavaScript tests by adding code coverage statistics (which lines of your source code are covered by your tests).

Blanket works in a 3 step process:

1. Loading your source files using a modified [RequireJS](http://requirejs.org/) script
2. Parsing the code using [Esprima](http://esprima.org) and [node-falafel](https://github.com/substack/node-falafel), and instrumenting the file by adding code tracking lines.
3. Connecting to hooks in the test runner to output the coverage details after the tests have completed.

## Install

1. Download [blanket.js](https://raw.github.com/Migrii/blanket/live/dist/blanket.js) ([/dist/blanket.js](https://raw.github.com/Migrii/blanket/live/dist/blanket.js)).  Or build it yourself by running `node builder.js` in /lib.
2. Add the following line to your qunit test runner html file:  
     `<script src="blanket.js"></script>`

## Configure

1. Add the data attribute `data-cover` to any script file you want covered.   
   Ex:   
     `<script src="mylibrary.js data-cover></script>`  
2. Run the tests (with the 'Enable Coverage' box checked) and you'll see the coverage statistics appended below the test results.

## Disclaimer

This product is currently in beta release and is NOT stable or production ready.  It is subject to changes.  We appreciate any feedback or assistance.

## Documentation
_(Coming soon)_

## License
Copyright (c) 2012 Alex-Seville  
Licensed under the MIT license.
