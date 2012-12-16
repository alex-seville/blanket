# Intermediate Guide (nodejs version)

This guide details using Blanket.js with a mocha testrunner, and the travis-cov reporter in NodeJS.

It is assumed you have already read the Getting Started guide.

To begin you will need:  
* an existing mocha tests/test runner (including the mocha module, `npm install mocha -g`)
* source files

1. Install Blanket: `npm install blanket`

2. Add the following to top of your test runner file:

```
var blanket = require("blanket");
blanket.setFilter("/source/");
```

  where `/source/` matches partially or fully the directory where the source files to be instrumented are stored.  You can also provide an array of regular expression.  Omitting the second line will default to "src".  Additionally, any value provided here will override values set in the package.json file.

  Since we've explicit referenced blanket we don't need to require it in the mocha command.

3. Install the travis-cov reporter: `npm install travis-cov`

4. Add the following to your package.json file:

```
"scripts": {
    "travis-cov": {
      "threshold": 70
    }
}
```

  This will set the coverage threshold at 70%.  Any tests falling below 70% will fail, and (when run on travis-ci) will cause the build to fail.

4. Use the travis-cov reporter to display coverage percentage:

```mocha <path to test runner> -R travis-cov```

