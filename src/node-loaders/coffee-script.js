var fs = require("fs"),
    path = require("path");

module.exports = function(blanket) {
    var coffeeScript = require("coffee-script"),
        oldLoaderCS = require.extensions['.coffee'];

    require.extensions['.coffee'] = function(localModule, filename) {
        var antipattern = blanket.options("antifilter"),
            pattern = blanket.options("filter");
        filename = blanket.normalizeBackslashes(filename);

        if (typeof antipattern !== "undefined" && blanket.matchPattern(filename.replace(/\.coffee$/, ""), antipattern)) {

            oldLoaderCS(localModule, filename);
            if (blanket.options("debug")) {
                console.log("BLANKET-File will never be instrumented:" + filename);
            }
        } else if (blanket.matchPattern(filename, pattern)) {
            if (blanket.options("debug")) {
                console.log("BLANKET-Attempting instrument of:" + filename);
            }

            var content = fs.readFileSync(filename, 'utf8');
            content = coffeeScript.compile(content);
            blanket.instrument({
                inputFile: content,
                inputFileName: filename
            }, function(instrumented) {
                var baseDirPath = blanket.normalizeBackslashes(path.dirname(filename)) + '/.';
                try {
                    instrumented = instrumented.replace(/require\s*\(\s*("|')\./g, 'require($1' + baseDirPath);
                    localModule._compile(instrumented, filename);
                } catch (err) {
                    console.log("Error parsing instrumented code: " + err);
                }
            });
        } else {
            oldLoaderCS(localModule, filename);
        }
    };
};