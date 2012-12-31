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
    file = JSON.parse(fs.readFileSync(configPath, 'utf8')),
    packageConfig = file.scripts &&
                    file.scripts.blanket &&
                    file.scripts.blanket.pattern ?
                      file.scripts.blanket.pattern :
                      "src",
    pattern = packageConfig,
    blanket = require("./blanket").blanket,
    oldLoader = require.extensions['.js'];


blanket.options("filter",pattern);

//helper functions
blanket.normalizeBackslashes = function (str) {
    return str.replace(/\\/g, '/');
};

//you can pass in a string, a regex, or an array of files
blanket.matchPattern = function (filename,pattern){
    if (typeof pattern === 'string'){
        return filename.indexOf(blanket.normalizeBackslashes(pattern)) > -1;
    }else if ( pattern instanceof Array ){
        return pattern.some(function(elem){
            return filename.indexOf(blanket.normalizeBackslashes(elem)) > -1;
        });
    }else if (pattern instanceof RegExp){
        return pattern.test(filename);
    }else{
        throw new Error("Bad file instrument indicator.  Must be a string, regex, or array.");
    }
};

//instrument js files
require.extensions['.js'] = function(localModule, filename) {
    var pattern = blanket.options("filter");
    filename = blanket.normalizeBackslashes(filename);
    if (blanket.matchPattern(filename,pattern)){
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
if (file.scripts.blanket.loader){
    require(file.scripts.blanket.loader)(blanket);
}

module.exports = blanket;



