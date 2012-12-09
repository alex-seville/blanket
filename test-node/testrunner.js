var path = require("path");
require("../src/index")("/src/blanket");

/*
since we're using blanket to test blanket,
we need to remove the module entry from the require cache
so that it can be instrumented.
*/
delete require.cache[path.normalize(__dirname+"/../src/blanket.js")];
/*
now start the tests
*/

require("./tests/blanket_core");
require("./tests/nested_test");