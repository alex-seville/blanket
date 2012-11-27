tests: test-nodejs test-browser test-browser-require test-backbone-koans test-custom-reporter

test-nodejs:
			@./node_modules/mocha/bin/mocha \
			--reporter travis-cov \
			test-node/testrunner.js

test-browser:
			@phantomjs node_modules/travis-cov/phantom_runner.js test/lib-tests/runner.html 80

test-browser-require:
			@phantomjs node_modules/travis-cov/phantom_runner.js test/requirejs/require_runner.html 80

test-backbone-koans:
			@phantomjs node_modules/travis-cov/phantom_runner.js test/backbone-koans/index.html?coverage=true 80

test-custom-reporter:
			@phantomjs node_modules/travis-cov/phantom_runner.js test/custom-reporter/index.html?coverage=true 80

