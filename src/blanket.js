var inBrowser = typeof exports === 'undefined';
var parseAndModify = (inBrowser ? window.falafel : require("./lib/falafel").falafel);

(inBrowser ? window : exports).blanket = (function(){
    var linesToAddTracking = [
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
    covVar = (inBrowser ?   "window._$blanket" : "_$jscoverage" ),
    reporter,instrumentFilter,__blanket,ordered,coffeescript,ignoreScriptError,
    copynumber = Math.floor(Math.random()*1000),
    coverageInfo = {},existingRequireJS=false;
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
        _reporter: null,
        extend: function(obj) {
            //borrowed from underscore
            _blanket._extend(_blanket,obj);
        },
        _extend: function(dest,source){
          if (source) {
            for (var prop in source) {
              if (dest[prop]){
                _blanket._extend(dest[prop],source[prop]);
              }else{
                  dest[prop] = source[prop];
              }
            }
          }
        },
        setExistingRequirejs: function(exists){
            existingRequireJS = exists || false;
        },
        getExistingRequirejs: function(){
            return existingRequireJS;
        },
        setFilter: function(filter){
            instrumentFilter = filter;
        },
        getFilter: function(){
            return instrumentFilter;
        },
        setReporter: function(reporterFcn){
            reporter = reporterFcn;
        },
        getReporter: function(){
            return reporter;
        },
        setOrdered: function(isOrdered){
            ordered = isOrdered;
        },
        getOrdered: function(isOrdered){
            return ordered;
        },
        setIgnoreScriptError: function(ignore){
            ignoreScriptError = ignore;
        },
        getIgnoreScriptError: function(){
            return ignoreScriptError;
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
        _prepareSource: function(source){
            return source.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/(\r\n|\n|\r)/gm,"\n").split('\n');
        },
        _trackingSetup: function(filename,sourceArray){
            
            var sourceString = sourceArray.join("',\n'");
            var intro = "if (typeof "+covVar+" === 'undefined') "+covVar+" = {};\n";
            intro += "if (typeof "+covVar+"['"+filename+"'] === 'undefined'){";
            
            intro += covVar+"['"+filename+"']=[];\n";
            intro += covVar+"['"+filename+"'].source=['"+sourceString+"'];\n";
            //initialize array values
            _blanket._trackingArraySetup.sort(function(a,b){
                return parseInt(a,10) > parseInt(b,10);
            }).forEach(function(item){
                intro += covVar+"['"+filename+"']["+item+"]=0;\n";
            });

            intro += "}";
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
        _addTracking: function (node,filename) {
            _blanket._blockifyIf(node);
            if (linesToAddTracking.indexOf(node.type) > -1){
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
                this.getReporter().call(this,coverageInfo);
            }
        }
    };
    return _blanket;
})();
