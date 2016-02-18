var fs = require("fs");
var path = require("path");


var transpile = function(transpiler, filename) {
    var transpiled = '';
    m = {
        _compile: function(c) {
            transpiled = c;
        }
    };
    transpiler(m, filename);
    return transpiled;
};

var wrapTranspiler = function(blanket, extension, oldLoader) {
    return function(localModule, filename) {
        var antipattern = blanket.options("antifilter");
        var pattern = blanket.options("filter");
        var reporter_options = blanket.options("reporter_options");
        var originalFilename = filename;
        var filenamePattern = new RegExp(extension, "i");

        filename = blanket.normalizeBackslashes(filename);

        if (typeof antipattern !== "undefined" && blanket.matchPattern(filename.replace(filenamePattern, ""), antipattern)) {
            if (blanket.options("debug")) {
                console.log("BLANKET-File will never be instrumented:" + filename);
            }
            oldLoader(localModule, filename);
        } else if (blanket.matchPattern(filename, pattern)) {
            if (blanket.options("debug")) {
                console.log("BLANKET-Attempting instrument of:" + filename);
            }

            var content = transpile(oldLoader, filename);
            var inputFilename = filename;
            if (reporter_options && reporter_options.shortnames) {
                inputFilename = filename.replace(path.dirname(filename), "");
            } else if (reporter_options && reporter_options.relativepath) {
                inputFilename = filename.replace(process.cwd(), "");
            }
            if (reporter_options && reporter_options.basepath) {
                inputFilename = filename.replace(reporter_options.basepath + '/', "");
            }

            blanket.instrument({
                inputFile: content,
                inputFileName: inputFilename
            }, function (instrumented) {
                var baseDirPath = blanket.normalizeBackslashes(path.dirname(filename)) + '/.';
                try {
                    instrumented = instrumented.replace(/require\s*\(\s*("|')\./g, 'require($1' + baseDirPath);
                    localModule._compile(instrumented, originalFilename);
                } catch (err) {
                    console.log("Error parsing instrumented code: " + err);
                }
            });
        } else {
            oldLoader(localModule, filename);
        }
    };
};

module.exports = function(blanket) {
    var extensions = require.extensions;
    for (var extension in extensions) {
        if (extensions.hasOwnProperty(extension)) {
            var transpiler = extensions[extension];
            require.extensions[extension] = wrapTranspiler(blanket, extension, transpiler)
        }
    }

};