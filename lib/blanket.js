module.exports.instrument = function(config, next){
    var inFile = config.inputFile,
        inFileName = config.inputFileName;
        
    var lines = inFile.split("\n");
    var instrumented = "";
    //TODO, we need to actually parse the js a bit,
    //or adding these lines can cause unprocessable js

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

module.exports.remap = function(config, next){
    var remapType = config.remapType,
        runner = config.content,
        remapped="";

    if (remapType === "qunit"){
        remapped = runner.replace("src/","src-cov/");
    }else if (remapType === "mocha"){
        //this is dirty, should use regex or something.
        remapped = runner.replace("require(\"../src/","require(\"../src-cov/");
        //dirty output
        remapped += "\nconsole.log(_$blanket);";
    }
    next(remapped);
};