/*
* Blanket main test runner
*
* This test runner calls the individual test runners
*/

var integrationTests = require('./integration/integration-runner');

//run integrationTests

integrationTests.run();