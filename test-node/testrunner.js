var path = require("path");
require("../lib/index")("/lib/blanket");

/*
since we're using blanket to test blanket,
we need to remove the module entry from the require cache
so that it can be instrumented.
*/
console.log(path.normalize(__dirname+"../lib/blanket.js"));
delete require.cache[path.normalize(__dirname+"/../lib/blanket.js")];
/*
now start the tests
*/

require("./tests/blanket_core");
require("./tests/nested_test");