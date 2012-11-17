

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
        "CommentStatement"     ,
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
    covVar = (typeof window === 'undefined' ?  "_$jscoverage" : "window._$blanket" ),
    blanket = {
        instrument: function(config, next){
            var inFile = config.inputFile,
                inFileName = config.inputFileName,
                lines = inFile.split("\n"),
                intro = "",
                escapes = "'";
            
            var sourceArray = this._prepareSource(inFile);
            

            instrumented =  falafel(inFile,{loc:true}, this._addTracking,inFileName);
            
            instrumented = this._trackingSetup+instrumented + "\n"+covVar+"['"+inFileName+"']["+sourceArray.length+"]++;";
            
            next(instrumented);
        },
        _prepareSource: function(source){
            var array = source.replace(/'/g,"\\'").replace(/(\r\n|\n|\r)/gm,"\n").split('\n');
            return array.join("',\n'");
        },
        _trackingSetup: function(filename,sourceArray){
            
            var sourceString = sourceArray.join("',\n'");
            var intro = "if (typeof "+covVar+" === 'undefined') "+covVar+" = {};\n";
            intro += "if (typeof "+covVar+"['"+filename+"'] === 'undefined'){";
            
            intro += covVar+"['"+filename+"']=[];\n";
            intro += covVar+"['"+filename+"'].source=['"+sourceString+"'];\n";
            //initialize array values
            for (var j=1;j<sourceArray.length+1;j++){
              intro += covVar+"['"+filename+"']["+j+"]=0;\n";
            }
            intro += "}";
            return intro;
        },
        _blockifyIf: function(node){
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
                    this._blockifyIf(bracketsExistAlt);
                }
            }
        },
        _addTracking: function (node,filename) {
                
            blanket._blockifyIf(node);
            
            if (linesToAddTracking.indexOf(node.type) > -1){
                if (node.type == "VariableDeclaration" &&
                    (node.parent.type == "ForStatement" || node.parent.type == "ForInStatement")){
                    return;
                }
                node.update(covVar+"['"+filename+"']["+node.loc.start.line+"]++;\n"+node.source());
            }
            
            
        },
        report: function(coverage_data){
            Reporter(coverage_data);
        },
        testEvents: {
            testsDone: function(){
                coverageData.stats.end = new Date();
                coverageData.files = covVar;
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


