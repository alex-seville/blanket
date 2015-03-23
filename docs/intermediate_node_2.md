# Intermediate Guide (nodejs version)

This guide details using Blanket.js with a locally installed mocha testrunner with their built-in html-cov reporter
in NodeJS by using configuration options in package.json.  This is useful for running coverage on remote continuous
integration services like CircleCI or TravisCI.

It is assumed you have already read the Getting Started guide.

1. Install Mocha locally: `npm install mocha --save-dep`

1. Install Blanket: `npm install blanket --save-dep`

2. Install mocha-multi so we can use two reporters at once.  One reporter is the result of the tests, and the other is
for coverage.  `npm install mocha-multi --save-dep`

3. In your package.json file, add the following:

```json
  "scripts": {
    "start": "node app.js",
    "test": "multi='dot=- html-cov=coverage.html' ./node_modules/mocha/bin/mocha -r blanket --reporter mocha-multi --no-colors"
  },
  "config": {
    "blanket": {
      "pattern": "//\/[\\w-]+\\.js$/",
      "data-cover-never": [
        "node_modules",
        "public"
      ],
      "data-cover-reporter-options": {
        "shortnames": true
      }
    }
  },
```

In this example, we're not unit testing the node_modules or the public directories, and we're only reporting coverage
for files that only have letters or dashes in their names.  This would show coverage for `index.js`, but not `index.test.js`.

The short names option would only report the file's name, and not its complete path.

4. Run `npm test`.  It will report the results of the unit tests, and create coverage.html in your project's root.

