var parseAndModify = (typeof exports === 'undefined' ? window.falafel : require("./falafel").falafel);

(typeof exports === 'undefined' ? window : exports).blanket = (function(){
    var linesToAddTracking = [
        "ExpressionStatement",
        "LabeledStatement"   ,
        "BreakStatement"   ,
        "ContinueStatement" ,
        "VariableDeclaration",
        "ReturnStatement"   ,
        "ThrowStatement"   ,
        "Line",
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
    covVar = (typeof window === 'undefined' ?  "_$jscoverage" : "window._$blanket" ),
    blanket = {
        //Change to a data-cover-only attribute on the reference
        //to this script
        loadOnly: "",
        instrument: function(config, next){
            var inFile = config.inputFile,
                inFileName = config.inputFileName;
            var sourceArray = this._prepareSource(inFile);
            blanket._trackingArraySetup=[];
            var instrumented =  parseAndModify(inFile,{loc:true,comment:true}, this._addTracking,inFileName);
            instrumented = this._trackingSetup(inFileName,sourceArray)+instrumented;
            next(instrumented);
        },
        _trackingArraySetup: [],
        _prepareSource: function(source){
            return source.replace(/'/g,"\\'").replace(/(\r\n|\n|\r)/gm,"\n").split('\n');
        },
        _trackingSetup: function(filename,sourceArray){
            
            var sourceString = sourceArray.join("',\n'");
            var intro = "if (typeof "+covVar+" === 'undefined') "+covVar+" = {};\n";
            intro += "if (typeof "+covVar+"['"+filename+"'] === 'undefined'){";
            
            intro += covVar+"['"+filename+"']=[];\n";
            intro += covVar+"['"+filename+"'].source=['"+sourceString+"'];\n";
            //initialize array values
            blanket._trackingArraySetup.sort().forEach(function(item){
                intro += covVar+"['"+filename+"']["+item+"]=0;\n";
            });

            intro += "}";
            return intro;
        },
        _blockifyIf: function(node){
            
            if (linesToAddBrackets.indexOf(node.type) > -1){
                var bracketsExistObject = node.consequent || node.body;
                var bracketsExistAlt = node.alternate;
                if( bracketsExistAlt && bracketsExistAlt.type != "BlockStatement") {
                    bracketsExistAlt.update("{\n"+bracketsExistAlt.source()+"}\n");
                }
                if( bracketsExistObject && bracketsExistObject.type != "BlockStatement") {
                    bracketsExistObject.update("{\n"+bracketsExistObject.source()+"}\n");
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
                if (node.loc && node.loc.start){
                    node.update(covVar+"['"+filename+"']["+node.loc.start.line+"]++;\n"+node.source());
                    blanket._trackingArraySetup.push(node.loc.start.line);
                }else{
                    //I don't think we can handle a node with no location
                    throw new Error("The instrumenter encountered a node with no location: "+Object.keys(node));
                }
                
            }
        },
        report: function(coverage_data){
            coverage_data.files = (typeof window === 'undefined' ?  _$jscoverage : window._$blanket );
            Reporter(coverage_data);
        }
    };
    return blanket;
})();


