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
    astgen = {
        variable: function (name) { return { type: "Identifier", name: name }; },
        stringLiteral: function (str) { return { type: "Literal", value: String(str) }; },
        numericLiteral: function (num) { return { type: "Literal", value: Number(num) }; },
        statement: function (contents) { return { type: "ExpressionStatement", expression: contents }; },
        dot: function (obj, field) { return { type: "MemberExpression", computed: false, object: obj, property: field }; },
        subscript: function (obj, sub) { return { type: "MemberExpression", computed: true, object: obj, property: sub }; },
        postIncrement: function (obj) { return { type: "UpdateExpression", operator: '++', prefix: false, argument: obj }; },
        sequence: function (one, two) { return { type: "SequenceExpression", expressions: [one, two] }; }
    };
    covVar = (typeof window === 'undefined' ?  "_$jscoverage" : "window._$blanket" ),
    blanket = {
        instrument: function(config, next){
            var inFile = config.inputFile,
                inFileName = config.inputFileName;
            var sourceArray = this._prepareSource(inFile);
            var instrumented =  parseAndModify(inFile,{loc:true,comment:true}, this._addTracking,inFileName);
            instrumented = this._trackingSetup(inFileName,sourceArray)+instrumented;
            next(instrumented);
        },
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
                if( bracketsExistAlt && bracketsExistAlt.type != "BlockStatement") {
                    bracketsExistAlt.update("{\n"+bracketsExistAlt.source()+"}\n");
                }
                //if (bracketsExistAlt){
                //    this._blockifyIf(bracketsExistAlt);
                //}
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
                    node.update(covVar+"['"+filename+"']["+(node.loc.start.line-1)+"]++;\n"+node.source());
                }else{
                    //I don't think we can handle a node with no location
                    throw new Error("The instrumenter encountered a node with no location: "+Object.keys(node));
                }
                
            }
        },
        report: function(coverage_data){
            coverage_data.files = (typeof window === 'undefined' ?  _$jscoverage : window._$blanket );
            console.log("COVERAGE DATA:"+covVar);
            Reporter(coverage_data);
        }
    };
    return blanket;
})();


