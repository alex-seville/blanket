/*---------------------------------*/
/*                                 */
 /*---------------------------------*/
  /* Blanket.js                      */
   /* version 1.0.0                   */
  /* See README.md for revision news */
 /*---------------------------------*/
  /*                                */
  /*-------------------------------*/


var fs = require("fs"),
    path = require("path"),
    configPath = process.cwd() + '/package.json',
    file = require(configPath);
    packagePattern = file.scripts && file.scripts.blanket && file.scripts.blanket.pattern || 'src';
    packageRegexPattern = file.scripts && file.scripts.blanket && file.scripts.blanket.regexPattern;
    blanket = require("./blanket").blanket,
    oldLoader = require.extensions['.js'];


blanket.options("filter", packagePattern);

if (packageRegexPattern) {
    blanket.options("filterRegex", new RegExp(packageRegexPattern));
}

//helper functions
blanket.normalizeBackslashes = function (str) {
    return str.replace(/\\/g, '/');
};

//you can pass in a string, a regex, or an array of files
blanket.matchPattern = function (filename){
    var pattern = blanket.options("filterRegex") || blanket.options("filter");
    if (typeof pattern === 'string'){
        return filename.indexOf(blanket.normalizeBackslashes(pattern)) > -1;
    }else if ( pattern instanceof Array ){
        return pattern.some(function(elem){
            return filename.indexOf(blanket.normalizeBackslashes(elem)) > -1;
        });
    }else if (pattern instanceof RegExp){
        return pattern.test(filename);
    }else if (typeof pattern === 'function'){
        return pattern(filename);
    }else{
        throw new Error("Bad file instrument indicator.  Must be a string, regex, function, or array.");
    }
};

//instrument js files
require.extensions['.js'] = function(localModule, filename) {
    filename = blanket.normalizeBackslashes(filename);
    if (blanket.matchPattern(filename)){
        var content = fs.readFileSync(filename, 'utf8');
        blanket.instrument({
            inputFile: content,
            inputFileName: filename
        },function(instrumented){
            var baseDirPath = blanket.normalizeBackslashes(path.dirname(filename))+'/.';
            try{
                instrumented = instrumented.replace(/require\s*\(\s*("|')\./g,'require($1'+baseDirPath);
                localModule._compile(instrumented, filename);
            }
            catch(err){
                console.log("Error parsing instrumented code: "+err);
            }
        });
    }else{
        oldLoader(localModule,filename);
    }
};

//if a loader is specified, use it
if (file.scripts && file.scripts.blanket && file.scripts.blanket.loader){
    require(file.scripts.blanket.loader)(blanket);
}

module.exports = blanket;



