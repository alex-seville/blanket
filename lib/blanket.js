(typeof exports === 'undefined' ? window : exports).blanket = (function(){
    var coverageData,
    linesToAddTracking = [
        "ExpressionStatement",
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
        "WithStatement"
    ],
    linesToAddBrackets = [
        "IfStatement"       ,
       
        "WhileStatement"    ,
        "DoWhileStatement"      ,
        "ForStatement"   ,
        "ForInStatement"  ,
        "WithStatement"
    ],
    covVar = (typeof exports === 'undefined' ? "window._$blanket" : "_$jscoverage"),
    blanket = {
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
                    node.update(covVar+"['"+inFileName+"']["+node.loc.start.line+"]++;\n"+node.source());
                }
                
                
            };

                     
            
            //prepare the source array
            outputSrc = inFile;
            var escapes = "'";
            var array = outputSrc.replace(/'/g,"\\'").replace(/(\r\n|\n|\r)/gm,"\n").split('\n');

            

            var newSource = array.join("',\n'");
            //source array done
            
            instrumented =  falafel(inFile,{loc:true}, checkForOneLiner);
            intro = "if (typeof "+covVar+" === 'undefined') "+covVar+" = {};\n";
            intro += "if (typeof "+covVar+"['"+inFileName+"'] === 'undefined'){";
            
            intro += covVar+"['"+inFileName+"']=[];\n";
            intro += covVar+"['"+inFileName+"'].source=['"+newSource+"'];\n";
            //initialize array values
            for (var j=1;j<array.length+1;j++){
              intro += covVar+"['"+inFileName+"']["+j+"]=0;\n";
            }
            intro += "}";
            instrumented = intro+instrumented + "\n"+covVar+"['"+inFileName+"']["+array.length+"]++;";
            
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