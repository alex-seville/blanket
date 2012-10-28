

var linesToAddTracking = ["ExpressionStatement",
                "LabeledStatement"   ,
                "BreakStatement"   ,
                "ContinueStatement" ,
                "VariableDeclaration",
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

window.blanket = (function(){
    var coverageData;
    var blanket = {
        instrument: function(config, next){
            var inFile = config.inputFile,
                inFileName = config.inputFileName,
                outputSrc;
                
            var lines = inFile.split("\n");
            var intro = "";
            //TODO, separate this out
            var recurCheckConsAlt = function(node){
                if (linesToAddBrackets.indexOf(node.type) > -1){
                    var bracketsExistObject = node.consequent || node.body;
                    var bracketsExistAlt = node.alternate;
                    if( bracketsExistObject && bracketsExistObject.type != "BlockStatement") {
                        bracketsExistObject.update("{\n"+bracketsExistObject.source()+"\n}");
                    }
                    if( bracketsExistAlt && bracketsExistAlt.type != "BlockStatement") {
                        bracketsExistAlt.update("{\n"+bracketsExistAlt.source()+"\n}");
                    }
                    if (bracketsExistAlt){
                        recurCheckConsAlt(bracketsExistAlt);
                    }
                }
            };
            var checkForOneLiner = function (node) {
                
                recurCheckConsAlt(node);
                
                if (linesToAddTracking.indexOf(node.type) > -1){
                    if (node.type == "VariableDeclaration" &&
                        (node.parent.type == "ForStatement" || node.parent.type == "ForInStatement")){
                        return;
                    }
                    node.update("_$blanket['"+inFileName+"']["+i+"]++;\n"+node.source());
                    i++;
                }
                
                
            };

                     
            var i=0;
            //prepare the source array
            outputSrc = inFile;
            var escapes = "'";
            var array = outputSrc.split('\n');

            for(var k = 0; k < array.length; ++k) {
               array[k] = array[k].replace( new RegExp("'","gm"),"\\'");
            }

            var newSource = array.join("',\n'");
            //source array done

            instrumented =  falafel(inFile, checkForOneLiner);
            intro = "if (!window._$blanket) window._$blanket = {};\n";
            intro += "window._$blanket['"+inFileName+"']=[];\n";
            intro += "window._$blanket['"+inFileName+"'].source=['"+newSource+"'];\n";
            //initialize array values
            for (var j=0;j<i;j++){
              intro += "_$blanket['"+inFileName+"']["+j+"]=0;\n";
            }
            instrumented = intro+instrumented;
            next(instrumented);
        },
        report: function(coverage_data){
            Reporter(coverage_data);
        },
        testEvents: {
            testsDone: function(){
                coverageData.stats.end = new Date();
                coverageData.files = _$blanket;
                blanket.report(coverageData);
            },
            suiteStart: function(){
                coverageData.stats.suites++;
            },
            testStart: function(){
                coverageData.stats.tests++;
                coverageData.stats.pending++;
            },
            testDone: function(details){
                if(details.passed == details.total){
                    coverageData.stats.passes++;
                }else{
                    coverageData.stats.failures++;
                }
                coverageData.stats.pending--;
            },
            testsStart: function(){
                coverageData = {};
                //add the basic info, based on jscoverage
                coverageData.instrumentation = "blanket";
                
                coverageData.stats = {
                    "suites": 0,
                    "tests": 0,
                    "passes": 0,
                    "pending": 0,
                    "failures": 0,
                    "start": new Date()
                };
            }
        }
    };
    return blanket;
})();