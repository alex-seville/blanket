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
        runnerContent = config.content,
        remapped ="";

    if (remapType === "qunit"){
        prepareReportForQunit(runnerContent, next);
    } else if (remapType === "jasmine"){
        prepareForJasmine(runnerContent, next);
    } else if (remapType === "mocha"){
        prepareForMocha(runnerContent, next);
    }
};

var prepareForMocha = function(runnerContent, next) {
    //this is dirty, should use regex or something.
    var remapped = runnerContent.replace("require(\"../src/","require(\"../src-cov/");
    //dirty output
    remapped += "\nconsole.log(_$blanket);";
    next(remapped);
};


var prepareReportForQunit = function(runnerContent, next) {
    
    var remapped = runnerContent.replace("src/","src-cov/");
    //read content of the reporter.js and inject it
    fs = require('fs');
    fs.readFile('../lib/reporter.js', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        console.log(data);
        var scriptReport = QunitCode.replace("{{reporter}}", data);
        remapped += scriptReport;
        next(remapped);
    });
};


var QunitCode = "<script>QUnit.done(function( details ){ {{reporter}} })</script>";
var jasmineCode = "<script>jasmine.Runner.prototype.finishCallback = function() {jasmine.getEnv().reporter.reportRunnerResults(this);{{reporter}}};</script>";

var prepareForJasmine = function(runnerContent, next) {

    var remapped = runnerContent.replace("src/","src-cov/");
    //read content of the reporter.js and inject it
    fs = require('fs');
    fs.readFile('../lib/reporter.js', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        console.log(data);
        var scriptReport = jasmineCode.replace("{{reporter}}", data);
        remapped += scriptReport;
        next(remapped);
    });
};
