
module.exports = jsCover;


function jsCover (options,callback) {
  var inputFile = options.inputFile,
      inputFileName = options.inputFileName;

  //instrument
  function instrument(inFile,inFileName,next){
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
  }

  instrument(inputFile,inputFileName,callback);
}