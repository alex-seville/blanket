var blanket =  require("./blanket").blanket;

function normalizeBackslashes(str) {
    return str.replace(/\\/g, '/');
}

//not completed, still needs a lot of work.
module.exports = function(){
    var fs = require("fs");
    var oldLoader = require.extensions['.js'];
    var path = require("path");

    //you can pass in a string, a regex, or an array of files
    function matchPattern(filename,pattern){
        if (typeof pattern === 'string'){
            return filename.indexOf(normalizeBackslashes(pattern)) > -1;
        }else if ( pattern instanceof Array ){
            return pattern.some(function(elem){
                return filename.indexOf(normalizeBackslashes(elem)) > -1;
            });
        }else if (pattern instanceof RegExp){
            return pattern.test(filename);
        }else{
            throw new Error("Bad file instrument indicator.  Must be a string, regex, or array.");
        }
    }

    //find current scripts
    require.extensions['.js'] = function(localModule, filename) {
        var pattern = blanket.options("filter");
        filename = normalizeBackslashes(filename);
        if (matchPattern(filename,pattern)){
            var content = fs.readFileSync(filename, 'utf8');
            blanket.instrument({
                inputFile: content,
                inputFileName: filename
            },function(instrumented){
                var baseDirPath = normalizeBackslashes(path.dirname(filename))+'/.';
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
}();
