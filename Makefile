tests: test-nodejs test-browser

test-nodejs:
			@./node_modules/mocha/bin/mocha \
			--reporter travis-cov \
			test-node/testrunner.js

test-browser:
			@phantomjs node_modules/travis-cov/phantom_runner.js test/runner.html 80

test-browser-require:
			@phantomjs node_modules/travis-cov/phantom_runner.js test/require_runner.html 20

test-backbone-koans:
			@phantomjs node_modules/travis-cov/phantom_runner.js test/backbone-koans/index.html 20

