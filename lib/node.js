//not completed, still needs a lot of work.
module.exports = function(subdir){
    var fs = require("fs");
    var oldLoader = require.extensions['.js'];
    //find current scripts
    require.extensions['.js'] = function(module, filename) {    
        if (filename.indexOf("/"+subdir+"/") > -1){ 
            var content = fs.readFileSync(filename, 'utf8');
            
            blanket.instrument({
                inputFile: content,
                inputFileName: filename
            },function(instrumented){
                try{
                    content += " global._$jscoverage = _$blanket;";
                    module.exports = eval(content);
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