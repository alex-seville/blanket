var inBrowser = typeof exports === 'undefined';
var parseAndModify = (inBrowser ? window.falafel : require("./lib/falafel").falafel);

(inBrowser ? window : exports).blanket = (function(){
    var linesToAddTracking = [
        "ExpressionStatement",
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
    covVar = (inBrowser ?   "window._$blanket" : "_$jscoverage" ),
    __blanket,
    copynumber = Math.floor(Math.random()*1000),
    coverageInfo = {},options = {
        reporter: null,
        adapter:null,
        filter: null,
        orderedLoading: true,
        loader: null,
        ignoreScriptError: false,
        existingRequireJS:false,
        autoStart: false,
        timeout: 180
    };
    
    if (inBrowser && typeof window.blanket !== 'undefined'){
        __blanket = window.blanket.noConflict();
    }
    
    _blanket = {
        noConflict: function(){
            if (__blanket){
                return __blanket;
            }
            return _blanket;
        },
        _getCopyNumber: function(){
            //internal method
            //for differentiating between instances
            return copynumber;
        },
        extend: function(obj) {
            //borrowed from underscore
            _blanket._extend(_blanket,obj);
        },
        _extend: function(dest,source){
          if (source) {
            for (var prop in source) {
              if ( dest[prop] instanceof Object && typeof dest[prop] !== "function"){
                _blanket._extend(dest[prop],source[prop]);
              }else{
                  dest[prop] = source[prop];
              }
            }
          }
        },
        options: function(key,value){
            if (typeof key !== "string"){
                _blanket._extend(options,key);
            }else if (typeof value === 'undefined'){
                return options[key];
            }else{
                options[key]=value;
            }
        },
        instrument: function(config, next){
            var inFile = config.inputFile,
                inFileName = config.inputFileName;
            var sourceArray = _blanket._prepareSource(inFile);
            _blanket._trackingArraySetup=[];
            var instrumented =  parseAndModify(inFile,{loc:true,comment:true}, _blanket._addTracking,inFileName);
            instrumented = _blanket._trackingSetup(inFileName,sourceArray)+instrumented;
            next(instrumented);
        },
        _trackingArraySetup: [],
        _branchingArraySetup: [],
        _prepareSource: function(source){
            return source.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/(\r\n|\n|\r)/gm,"\n").split('\n');
        },
        _trackingSetup: function(filename,sourceArray){
            
            var sourceString = sourceArray.join("',\n'");
            var intro = "";

            intro += "if (typeof "+covVar+" === 'undefined') "+covVar+" = {};\n";
            intro += "if (typeof "+covVar+"['"+filename+"'] === 'undefined'){";
            
            intro += covVar+"['"+filename+"']=[];\n";
            intro += covVar+"['"+filename+"'].branchData=[];\n";
            intro += covVar+"['"+filename+"'].source=['"+sourceString+"'];\n";
            //initialize array values
            _blanket._trackingArraySetup.sort(function(a,b){
                return parseInt(a,10) > parseInt(b,10);
            }).forEach(function(item){
                intro += covVar+"['"+filename+"']["+item+"]=0;\n";
            });

            _blanket._branchingArraySetup.sort(function(a,b){
                return a.line > b.line && a.column > b.column;
            }).forEach(function(item){
                if (item.file === filename){
                    intro += covVar+"['"+filename+"'].branchData["+item.line+"] = [];\n";
                    intro += covVar+"['"+filename+"'].branchData["+item.line+"]["+item.column+"] = [];\n";
                }
            });
            intro += "}";
            _blanket._branchingArraySetup.forEach(function(item){
                if (item.file === filename){
                    intro += item.fcn + "\n";
                }
            });
            return intro;
        },
        _blockifyIf: function(node){
            
            if (linesToAddBrackets.indexOf(node.type) > -1){
                var bracketsExistObject = node.consequent || node.body;
                var bracketsExistAlt = node.alternate;
                if( bracketsExistAlt && bracketsExistAlt.type !== "BlockStatement") {
                    bracketsExistAlt.update("{\n"+bracketsExistAlt.source()+"}\n");
                }
                if( bracketsExistObject && bracketsExistObject.type !== "BlockStatement") {
                    bracketsExistObject.update("{\n"+bracketsExistObject.source()+"}\n");
                }
            }
        },
        _trackBranch: function(node,filename){
            //recursive on consequent and alternative
            var line = node.loc.start.line;
            var col = node.loc.start.column;
            var fcnName = "blanket_branch_"+line+"_"+col;
            var fcn = "function "+fcnName+"(result) {\n"+
            "    "+covVar+"['"+filename+"'].branchData["+line+"]["+col+"].push(result);\n"+
            "    return result;\n"+
            "}\n";
            _blanket._branchingArraySetup.push({
                line: line,
                column: col,
                fcnName: fcnName,
                fcn: fcn,
                file:filename
            });

            var source = node.source();
            var updated = fcnName+
                          "("+source.slice(0,source.indexOf("?"))+
                          ")"+source.slice(source.indexOf("?"));
            node.update(updated);
        },
        _addTracking: function (node,filename) {
            _blanket._blockifyIf(node);
            if (linesToAddTracking.indexOf(node.type) > -1 && node.parent.type !== "LabeledStatement"){
                if (node.type === "VariableDeclaration" &&
                    (node.parent.type === "ForStatement" || node.parent.type === "ForInStatement")){
                    return;
                }
                if (node.loc && node.loc.start){
                    node.update(covVar+"['"+filename+"']["+node.loc.start.line+"]++;\n"+node.source());
                    _blanket._trackingArraySetup.push(node.loc.start.line);
                }else{
                    //I don't think we can handle a node with no location
                    throw new Error("The instrumenter encountered a node with no location: "+Object.keys(node));
                }
            }else if (node.type === "ConditionalExpression"){
                _blanket._trackBranch(node,filename);
            }
        },
        setupCoverage: function(){
            coverageInfo.instrumentation = "blanket";
            coverageInfo.stats = {
                "suites": 0,
                "tests": 0,
                "passes": 0,
                "pending": 0,
                "failures": 0,
                "start": new Date()
            };
        },
        _checkIfSetup: function(){
            if (!coverageInfo.stats){
                throw new Error("You must call blanket.setupCoverage() first.");
            }
        },
        onTestStart: function(){
            this._checkIfSetup();
            coverageInfo.stats.tests++;
            coverageInfo.stats.pending++;
        },
        onTestDone: function(total,passed){
            this._checkIfSetup();
            if(passed === total){
                coverageInfo.stats.passes++;
            }else{
                coverageInfo.stats.failures++;
            }
            coverageInfo.stats.pending--;
        },
        onModuleStart: function(){
            this._checkIfSetup();
            coverageInfo.stats.suites++;
        },
        onTestsDone: function(){
            this._checkIfSetup();
            coverageInfo.stats.end = new Date();
            if (typeof exports === 'undefined'){
                this.report(coverageInfo);
            }else{
                this.options("reporter").call(this,coverageInfo);
            }
        }
    };
    return _blanket;
})();
