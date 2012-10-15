module.exports.instrument = function(config, next){
    var inFile = config.inputFile,
        inFileName = config.inputFileName;
        
    var lines = inFile.split("\n");
    var instrumented = "";
    //set up namespace
    instrumented += "if (typeof _$blanket === 'undefined') { _$blanket = {}; }\n";
    //initialize file object
    instrumented += "_$blanket['"+inFileName+"']=[];\n";
    //initialize array values
    for (var j=0;j<lines.length;j++){
      instrumented += "_$blanket['"+inFileName+"']["+j+"]=0;\n";
    }
    for (var i=0;i<lines.length;i++){
      instrumented += "_$blanket['"+inFileName+"']["+i+"]++;\n";
      instrumented += lines[i]+"\n";
    }
    next(instrumented);
};