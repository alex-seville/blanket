
module.exports = jsCover;


function jsCover (options,callback) {
  var inputFile = options.inputFile,
      inputFileName = options.inputFileName;

  //instrument
  function instrument(inFile,inFileName,next){
    var lines = inFile.split("\n");
    var instrumented="";
    instrumented = "if (!_$jscover) { _$jscover = {}; }\n";
    for (var i=0;i<lines.length;i++){
      instrumented = "_$jscover['"+inFileName+"']["+i+"]++;\n";
      instrumented = lines[i]+"\n";
    }
    next(instrument);
  }

  instrument(inputFile,inputFileName,callback);
}