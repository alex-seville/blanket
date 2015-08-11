var fs = require("fs"),
    path = require("path");

module.exports = function(blanket, oldLoader, compile, filenamePattern) {
    return function(localModule, filename) {

        var antipattern = blanket.options("antifilter"),
            pattern = blanket.options("filter"),
            reporter_options = blanket.options("reporter_options"),
            originalFilename = filename;
        filename = blanket.normalizeBackslashes(filename);

        if (typeof antipattern !== "undefined" && blanket.matchPattern(filename.replace(filenamePattern, ""), antipattern)) {

            oldLoader(localModule, filename);
            if (blanket.options("debug")) {
                console.log("BLANKET-File will never be instrumented:" + filename);
            }
        } else if (blanket.matchPattern(filename, pattern)) {
            if (blanket.options("debug")) {
                console.log("BLANKET-Attempting instrument of:" + filename);
            }

            var content = fs.readFileSync(filename, 'utf8');
            content = compile(content);

            var inputFilename = filename;
            if (reporter_options && reporter_options.shortnames){
                inputFilename = filename.replace(path.dirname(filename),"");
            } else if (reporter_options && reporter_options.relativepath) {
                inputFilename = filename.replace(process.cwd(),"");
            }
            if (reporter_options && reporter_options.basepath){
                inputFilename = filename.replace(reporter_options.basepath + '/',"");
            }

            blanket.instrument({
                inputFile: content,
                inputFileName: inputFilename
            }, function(instrumented) {
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

