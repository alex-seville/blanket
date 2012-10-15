

module.exports.instrument = function(config,next){
    var inFile = config.inputFile,
        inFileName = config.inputFileName;
        
    var lines = inFile.split("\n");
    var instrumented="";
    //set up namespace
    instrumented += "if (typeof _$jscover === 'undefined') { _$jscover = {}; }\n";
    //initialize file object
    instrumented += "_$jscover['"+inFileName+"']=[];\n";
    //initialize array values
    for (var j=0;j<lines.length;j++){
      instrumented += "_$jscover['"+inFileName+"']["+j+"]=0;\n";
    }
    for (var i=0;i<lines.length;i++){
      instrumented += "_$jscover['"+inFileName+"']["+i+"]++;\n";
      instrumented += lines[i]+"\n";
    }
    next(instrumented);
};