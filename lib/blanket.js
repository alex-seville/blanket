var falafel = require('falafel');

var linesToAddTracking = ["ExpressionStatement",
                "LabeledStatement"   ,
                "BreakStatement"   ,
                "ContinueStatement" ,       
                "VariableDeclaration"     ,  
                "ReturnStatement"   ,
                "ThrowStatement"   ,
                "TryStatement"     ,
                "FunctionDeclaration"    ,
                "IfStatement"       ,
                "WhileStatement"    ,
                "DoWhileStatement"      ,
                "ForStatement"   ,
                "ForInStatement"  ,
                "SwitchStatement"  ,
                "WithStatement"  ];

var linesToAddBrackets = [
    "IfStatement"       ,
                "WhileStatement"    ,
                "DoWhileStatement"      ,
                "ForStatement"   ,
                "ForInStatement"  ,
                "WithStatement"
];

module.exports.instrument = function(config, next){
    var inFile = config.inputFile,
        inFileName = config.inputFileName;
        
    var lines = inFile.split("\n");
    var intro = "";
    //TODO, separate this out
    var checkForOneLiner = function (node) {
        if (linesToAddBrackets.indexOf(node.type) > -1){
            var bracketsExistObject = node.consequent || node.body;
            if( bracketsExistObject && bracketsExistObject.type != "BlockStatement") {
                bracketsExistObject.update("{\n"+bracketsExistObject.source()+"\n}");
            }
        }
        if (linesToAddTracking.indexOf(node.type) > -1){
            if (node.type == "VariableDeclaration" && node.parent.type == "ForStatement"){
                return;
            }
            node.update("_$blanket['"+inFileName+"']["+i+"]++;\n"+node.source());
            i++;
        }
        
    };

    //set up namespace
    intro += "if (typeof _$blanket === 'undefined') { _$blanket = {}; }\n";
    //initialize file object
    intro += "_$blanket['"+inFileName+"']=[];\n";
    //initialize array values
    for (var j=0;j<lines.length;j++){
      intro += "_$blanket['"+inFileName+"']["+j+"]=0;\n";
    }
    var i=0;
    instrumented =  intro+falafel(inFile, checkForOneLiner);
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
