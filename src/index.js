/*---------------------------------*/
/*                                 */
 /*---------------------------------*/
  /* Blanket.js                      */
   /* version 1.0.2                   */
  /* See README.md for revision news */
 /*---------------------------------*/
  /*                                */
  /*-------------------------------*/


var fs = require("fs"),
    path = require("path"),
    configPath = process.cwd() + '/package.json',
    file = JSON.parse(fs.readFileSync(configPath, 'utf8')),
    packageConfig = file.scripts &&
                    file.scripts.blanket,
    pattern = packageConfig  ?
                      file.scripts.blanket.pattern :
                      "src",
    blanket = require("./blanket").blanket,
    oldLoader = require.extensions['.js'];

var newOptions={};
Object.keys(file.scripts.blanket).forEach(function (option) {
    var optionValue = file.scripts.blanket[option];
    if(option === "data-cover-only" || option === "pattern"){
        newOptions.filter = optionValue;
    }
    if(option === "data-cover-never"){
        newOptions.antifilter = optionValue;
    }
    if (option === "data-cover-loader" || option === "loader"){
        newOptions.loader = optionValue;
    }
    if (option === "data-cover-timeout"){
        newOptions.timeout = optionValue;
    }
    if (option === "data-cover-flags"){
        newOptions.order = !option.unordered;
        newOptions.ignoreScriptError = !!option.ignoreError;
        newOptions.autoStart = !!option.autoStart;
        newOptions.branchTracking = !!option.branchTracking;
    }
});
blanket.options(newOptions);


//helper functions
blanket.normalizeBackslashes = function (str) {
    return str.replace(/\\/g, '/');
};

//you can pass in a string, a regex, or an array of files
blanket.matchPattern = function (filename,pattern){
    if (typeof pattern === 'string'){
        if (pattern.indexOf("[") === 0){
                //treat as array
            var pattenArr = pattern.slice(1,pattern.length-1).split(",");
            return pattenArr.some(function(elem){
                return blanket.matchPattern(filename,blanket.normalizeBackslashes(elem.slice(1,-1)));
            });
        }else if ( pattern.indexOf("//") === 0){
            var ex = pattern.slice(2,pattern.lastIndexOf('/'));
            var mods = pattern.slice(pattern.lastIndexOf('/')+1);
            var regex = new RegExp(ex,mods);
            return regex.test(filename);
        }else{
            return filename.indexOf(blanket.normalizeBackslashes(pattern)) > -1;
        }
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
if (blanket.options("loader")){
    require(blanket.options("loader"))(blanket);
}

module.exports = blanket;



