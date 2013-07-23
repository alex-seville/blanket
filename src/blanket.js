/*
  Blanket.js
  Blanket core
  Version 2.0
*/

(function(isNode,globalScope){
    var istanbul = isNode ? require("istanbul") : globalScope,
        istanbulUtils = isNode ? istanbul.utils : istanbul.coverageUtils,
        blanketUtils = isNode ? require("./common_utils") : Blanket.utils;

    function Blanket(options){
        this.opts = options || {
            reporter: undefined,
            filter: undefined,
            coverageVariable: "_$jscoverage",
            modulePattern: undefined,
            testReadyCallback:undefined,
            flags: {
                ignoreScriptError: false,
                existingRequireJS:false,
                autoStart: false,
                timeout: 180,
                ignoreCors: false,
                branchTracking: false,
                sourceURL: false,
                debug:false,
                engineOnly:false,
                commonJS:false
            } 
        };
        this.coverageInfo = {};
        this.instrumenter = new istanbul.Instrumenter({
            coverageVariable: this.opts.coverageVariable,
            embedSource: true,
            noCompact: false
        });
    }

    Blanket.prototype = {  
        instrument: function(code, filename, callback){
            filename = filename || String(new Date().getTime()) + '.js';

            var instrumentedCode =  this.instrumenter.instrumentSync(code,filename);
            //append sourceURL, if applicable
            if (this.opts.flags.sourceURL){
                instrumentedCode += "\n//@ sourceURL="+filename.replace("http://","");
            }
            this.debug("Instrumented file: "+filename);
            callback(instrumentedCode);
        },
        setOption: function(key,val){
            if (typeof val === "undefined"){
                this.opts = key;
            }else{
                if (this.opts.flags[key]){
                    this.opts.flags[key] = val;
                }else{
                    this.opts[key] = val;
                }
            }
        },
        getOption: function(key){
            if (this.opts.flags){
               return  this.opts.flags[key] || this.opts[key]; 
            }
            return this.opts[key];
        },
        /*
        // TODO: Check if coverageInfo.stats is actually required
        // for anything.
        setupCoverage: function(){
            this.coverageInfo.instrumentation = "blanket";
            this.coverageInfo.stats = {
                "suites": 0,
                "tests": 0,
                "passes": 0,
                "pending": 0,
                "failures": 0,
                "start": new Date()
            };
        },
        checkIfRunnerSetup: function(){
            if (!this.coverageInfo.stats){
                throw new Error("You must call blanket.setupCoverage() first.");
            }
        },
        onTestStart: function(){
            this.debug("Test event started");
            this.checkIfRunnerSetup();
            this.coverageInfo.stats.tests++;
            this.coverageInfo.stats.pending++;
        },
        onTestDone: function(total,passed){
            this.checkIfRunnerSetup();
            if(passed === total){
                this.coverageInfo.stats.passes++;
            }else{
                this.coverageInfo.stats.failures++;
            }
            this.coverageInfo.stats.pending--;
        },
        onModuleStart: function(){
            this.checkIfRunnerSetup();
            this.coverageInfo.stats.suites++;
        },
        onTestsDone: function(){
            this.debug("Test event done");
            this.checkIfRunnerSetup();
            this.coverageInfo.stats.end = new Date();
            
            this.coverageInfo.files = globalScope[this.opts.coverageVariable];
            if (!this.coverage_data.files || !Object.keys(this.coverage_data.files).length){
                this.debug("Reporting No files were instrumented");
                return;
            }
            istanbulUtils.addDerivedInfo(this.coverageInfo.files);
            this.opts.reporter.call(this,this.coverageInfo,this.opts.reporter_options);
        },
        */
        debug: function(msg){
            if (this.opts.flags.debug){
                blanketUtils.debug(msg);
            }
        }
    };

    if (isNode) {
        module.exports = Blanket;
    } else {
        globalScope.Blanket = Blanket;
    }
})(typeof window === "undefined",typeof window === "undefined" ? global : window);


