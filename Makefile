PHANTOM_QUNIT_RUNNER = test/helpers/phantom_qunit_runner.js
PHANTOM_JASMINE_RUNNER = test/helpers/phantom_jasmine_runner.js

PHANTOM_QUNIT_COVER = node_modules/travis-cov/phantom_runner.js
PHANTOM_JASMINE_COVER = node_modules/travis-cov/phantom_jasmine_runner.js

NODE_REPORTER = dot

EXTRA = 
THRESHOLD = 80

NODE_TESTRUNNER = test-node/testrunner.js
BROWSER_TESTRUNNER = test/lib-tests/runner.html
BROWSER_REQUIRE_TESTRUNNER = test/requirejs/require_runner.html
BROWSER_BACKBONE_TESTRUNNER = test/backbone-koans/index.html?coverage=true
BROWSER_REPORTER_TESTRUNNER = test/custom-reporter/index.html?coverage=true
BROWSER_JASMINE_TESTRUNNER = test/jasmine/SpecRunner.html


tests: build test-nodejs test-browser test-browser-require test-backbone-koans test-custom-reporter test-jasmine
tests-coverage: build test-nodejs-coverage test-browser-coverage test-browser-require-coverage test-backbone-koans-coverage test-custom-reporter-coverage test-jasmine-coverage

build:
			node lib/builder.js

test-nodejs:
			@./node_modules/mocha/bin/mocha \
			--reporter $(NODE_REPORTER) \
			$(NODE_TESTRUNNER)

test-nodejs-html:
			$(MAKE) test-nodejs \
			NODE_REPORTER=html-cov > coverage.html

test-browser:
			@phantomjs $(PHANTOM_QUNIT_RUNNER) \
			$(BROWSER_TESTRUNNER) $(EXTRA)

test-browser-require:
			@phantomjs $(PHANTOM_QUNIT_RUNNER) \
			$(BROWSER_REQUIRE_TESTRUNNER) $(EXTRA)

test-backbone-koans:
			@phantomjs $(PHANTOM_QUNIT_RUNNER) \
			$(BROWSER_BACKBONE_TESTRUNNER) $(EXTRA)

test-custom-reporter:
			@phantomjs $(PHANTOM_QUNIT_RUNNER) \
			$(BROWSER_REPORTER_TESTRUNNER) $(EXTRA)

test-jasmine:
			@phantomjs $(PHANTOM_JASMINE_RUNNER) \
			$(BROWSER_JASMINE_TESTRUNNER) $(EXTRA)

test-nodejs-coverage:
			$(MAKE) test-nodejs \
			NODE_REPORTER=travis-cov

test-browser-coverage:
			$(MAKE) test-browser \
			PHANTOM_QUNIT_RUNNER=$(PHANTOM_QUNIT_COVER) \
			EXTRA=$(THRESHOLD)

test-browser-require-coverage:
			$(MAKE) test-browser-require \
			PHANTOM_QUNIT_RUNNER=$(PHANTOM_QUNIT_COVER) \
			EXTRA=$(THRESHOLD)

test-backbone-koans-coverage:
			$(MAKE) test-backbone-koans \
			PHANTOM_QUNIT_RUNNER=$(PHANTOM_QUNIT_COVER) \
			EXTRA=$(THRESHOLD)

test-custom-reporter-coverage:
			$(MAKE) test-custom-reporter \
			PHANTOM_QUNIT_RUNNER=$(PHANTOM_QUNIT_COVER) \
			EXTRA=$(THRESHOLD)

test-jasmine-coverage:
			$(MAKE) test-jasmine \
			PHANTOM_JASMINE_RUNNER=$(PHANTOM_JASMINE_COVER) \
			EXTRA=$(THRESHOLD)
