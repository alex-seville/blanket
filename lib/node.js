//not completed, still needs a lot of work.
module.exports = function(subdir){
    var fs = require("fs");
    var oldLoader = require.extensions['.js'];
    //find current scripts
    require.extensions['.js'] = function(module, filename) {
        if (filename.indexOf(subdir) > -1){
            var content = fs.readFileSync(filename, 'utf8');
            
            exports.blanket.instrument({
                inputFile: content,
                inputFileName: filename
            },function(instrumented){
                try{
                    return eval(instrumented);
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