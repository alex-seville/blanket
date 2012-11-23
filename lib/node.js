var blanket =  require("./blanket").blanket;
//not completed, still needs a lot of work.
module.exports = function(subdir){
    var fs = require("fs");
    var oldLoader = require.extensions['.js'];
    var path = require("path");

    //you can pass in a string, a regex, or an array of files
    function matchPattern(filename){
        if (typeof subdir === 'string'){
            return filename.indexOf(subdir) > -1;
        }else if ( subdir instanceof Array ){
            return subdir.some(function(elem){
                return filename.indexOf(elem) > -1;
            });
        }else if (subdir instanceof RegExp){
            return subdir.test(filename);
        }else{
            throw Error("Bad file instrument indicator.  Must be a string, regex, or array.");
        }
    }

    //find current scripts
    require.extensions['.js'] = function(localModule, filename) {
        if (matchPattern(filename)){
            var content = fs.readFileSync(filename, 'utf8');
            blanket.instrument({
                inputFile: content,
                inputFileName: filename
            },function(instrumented){
                try{
                    instrumented = instrumented.replace(/require\("./g,"require(\""+path.dirname(filename)+"/.").replace(/require\('./g,"require('"+path.dirname(filename)+"/.");
                    
                    //try returning the module without exports first
                    var ret = eval(instrumented);
                    //We need to wrap the instrumented code in a closure
                    //in order to be able to correctly return the
                    //exports object from the eval
                    if (typeof ret !== 'undefined'){
                        var startWrapper = "(function(){\n";
                        var endWrapper = "\nreturn module.exports; })();";
                        ret = eval(startWrapper+instrumented+endWrapper);
                    }
                    
                    
                    //pass the exports back to the require statement
                    //that initiated all of this.
                    localModule.exports =  ret;
                }
                catch(err){
                    console.log("Error parsing instrumented code: "+err);
                }
            });
        }else{
            oldLoader(localModule,filename);
        }
    };
};
