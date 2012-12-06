/*
 * Qt+WebKit powered headless test runner using Phantomjs
 *
 * Phantomjs installation: http://code.google.com/p/phantomjs/wiki/BuildInstructions
 *
 * Run with:
 *  phantomjs runner.js [url-of-your-qunit-testsuite]
 *
 * E.g.
 *      phantomjs runner.js http://localhost/qunit/test
 */

/*jshint latedef:false */
/*global phantom:true require:true console:true */
var url = phantom.args[0],
	page = require('webpage').create();

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
	console.log(msg);
};

page.onInitialized = function() {
	page.evaluate(addLogging);
};
page.open(url, function(status){
	if (status !== "success") {
		console.log("Unable to access network: " + status);
		phantom.exit(1);
	} else {
		var interval = setInterval(function() {
			if (finished()) {
				clearInterval(interval);
				onfinishedTests();
			}
		}, 500);
	}
});

function finished() {
	return page.evaluate(function(){
		
		return !!window.mochaDone;
	});
}

function onfinishedTests() {
	var output = page.evaluate(function() {
			return JSON.stringify(window.qunitDone);
	});
	phantom.exit(JSON.parse(output).failed > 0 ? 1 : 0);
}

function addLogging() {
	window.addEventListener( "DOMContentLoaded", function() {
		var current_test_assertions = [];

		mocha.on("testDone",function(result) {
			
			var i,
				name = result.module + ': ' + result.name;

			if (result.failed) {
				console.log('Assertion Failed: ' + name);

				for (i = 0; i < current_test_assertions.length; i++) {
					console.log('    ' + current_test_assertions[i]);
				}
			}

			current_test_assertions = [];
		});


		mocha.on("done",function(result){
			console.log('Took ' + result.runtime +  'ms to run ' + result.total + ' tests. ' + result.passed + ' passed, ' + result.failed + ' failed.');
			window.mochaDone = result;
		});
	}, false );
}
