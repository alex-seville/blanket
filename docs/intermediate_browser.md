# Intermediate Guide (browser version)

This guide details using Blanket.js with a custom adapter to run Blanket with a test runner other than QUnit (ex. Jasmine), and covers some of the configuration options available.

It is assumed that you have already read the Getting Started guide.

To begin you will need:
-an existing test runner (including the test library script)
-source files
-tests for those source files


1. Download [Blanket.js](https://raw.github.com/Migrii/blanket/master/dist/qunit/blanket.min.js)

2. Download a Blanket adapter for your test runner.  Currently there are adapters for [Jasmine](https://raw.github.com/Migrii/blanket/master/src/adapters/jasmine-blanket.js) and (browser based) [Mocha](https://raw.github.com/Migrii/blanket/master/src/adapters/mocha-blanket.js).

2. Reference the script and adapter in the testrunner HTML file as follows:
```
<script src="blanket.min.js" data-cover-adapter="jasmine-blanket.js"></script>
```

3. Add a `data-cover-only` attribute to avoid having to add `data-cover` to each script you want covered.  You can pass the filter value as a string to match, an array of filename, or a regular expression:
```
<script src="blanket.min.js" data-cover-adapter="jasmine-blanket.js" data-cover-only="['source1.js','src/source2.js']"></script>
```

4. Open the test runner in the browser.  The coverage details will be appended below the test results.