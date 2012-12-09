var parseAndModify = (typeof exports === 'undefined' ? window.falafel : require("./lib/falafel").falafel);

(typeof exports === 'undefined' ? window : exports).blanket = (function(){
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
    covVar = (typeof window === 'undefined' ?  "_$jscoverage" : "window._$blanket" ),
    reporter,instrumentFilter,adapter,
    coverageInfo = {},existingRequireJS=false,
    blanket = {
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
            return source.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/(\r\n|\n|\r)/gm,"\n").split('\n');
        },
        _trackingSetup: function(filename,sourceArray){
            
            var sourceString = sourceArray.join("',\n'");
            var intro = "if (typeof "+covVar+" === 'undefined') "+covVar+" = {};\n";
            intro += "if (typeof "+covVar+"['"+filename+"'] === 'undefined'){";
            
            intro += covVar+"['"+filename+"']=[];\n";
            intro += covVar+"['"+filename+"'].source=['"+sourceString+"'];\n";
            //initialize array values
            blanket._trackingArraySetup.sort(function(a,b){
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
            blanket._blockifyIf(node);
            if (linesToAddTracking.indexOf(node.type) > -1){
                if (node.type === "VariableDeclaration" &&
                    (node.parent.type === "ForStatement" || node.parent.type === "ForInStatement")){
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
        setAdapter: function(adapterPath){
            adapter = adapterPath;
            
            if (typeof adapter !== "undefined"){
                var request = new XMLHttpRequest();
                request.open('GET', adapter, false);
                request.send();
                //load the adapter
                //better option than eval?
                //maybe adding a script tag
                eval(request.responseText);
            }
        },
        hasAdapter: function(callback){
            return typeof adapter !== "undefined";
        },
        report: function(coverage_data){
            coverage_data.files = (typeof window === 'undefined' ?  _$jscoverage : window._$blanket );
            if (reporter){
                require([reporter.replace(".js","")],function(r){
                    r(coverage_data);
                });
            }else if (typeof blanket.defaultReporter === 'function'){
                blanket.defaultReporter(coverage_data);
            }else{
                throw new Error("no reporter defined.");
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
        _bindStartTestRunner: function(bindEvent,startEvent){
            if (bindEvent){
                bindEvent(startEvent);
            }else{
                window.addEventListener("load",startEvent,false);
            }
        },
        testEvents: {
            beforeStartTestRunner: function(opts){
                opts = opts || {};
                opts.checkRequirejs = typeof opts.checkRequirejs === "undefined" ? true : opts.checkRequirejs;
                opts.callback = opts.callback || function() {  };
                opts.coverage = typeof opts.coverage === "undefined" ? true : opts.coverage;
                if(!(opts.checkRequirejs && blanket.getExistingRequirejs())){
                    if (opts.coverage){
                        blanket._bindStartTestRunner(opts.bindEvent,
                        function(){
                            blanket.setFilter(collectPageScripts());
                            require(blanket.getFilter(), function(){
                                opts.callback();
                            });
                        });
                    }else{
                        opts.callback();
                    }
                }
            },
            onTestStart: function(){
                blanket._checkIfSetup();
                coverageInfo.stats.tests++;
                coverageInfo.stats.pending++;
            },
            onTestDone: function(total,passed){
                blanket._checkIfSetup();
                if(passed === total){
                    coverageInfo.stats.passes++;
                }else{
                    coverageInfo.stats.failures++;
                }
                coverageInfo.stats.pending--;
            },
            onModuleStart: function(){
                blanket._checkIfSetup();
                coverageInfo.stats.suites++;
            },
            onTestsDone: function(){
                blanket._checkIfSetup();
                coverageInfo.stats.end = new Date();
                blanket.report(coverageInfo);
            }
        }
    };
    return blanket;
})();


