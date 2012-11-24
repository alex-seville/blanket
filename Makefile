tests: test-browser test-nodejs

test-nodejs:
			@./node_modules/mocha/bin/mocha \
			--reporter travis-cov \
			test-node/testrunner.js

test-browser:
			@phantomjs node_modules/travis-cov/phantom_runner.js test/runner.html 20
