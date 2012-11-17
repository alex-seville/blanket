//not completed, still needs a lot of work.
module.exports = function(subdir){
    var fs = require("fs");
    var oldLoader = require.extensions['.js'];
    var path = require("path");
    //find current scripts
    require.extensions['.js'] = function(module, filename) {
        if (filename.indexOf(subdir) > -1){
            var content = fs.readFileSync(filename, 'utf8');
            
            exports.blanket.instrument({
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
                        var endWrapper = "\nreturn exports; })();";
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
            oldLoader(module,filename);
        }
    };
};