var falafel = require('falafel'),
     Report = require('./report');

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

module.exports.remap = function(config, done){
    var report = new Report(config.remapType, config.content);

    report.format(done);
};
