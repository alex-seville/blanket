/*
  Blanket.js
  Blanket core
  Version 2.0
*/

(function(isNode,globalScope){
    var istanbul = isNode ? require("istanbul") : globalScope,
        istanbulUtils = isNode ? istanbul.utils : istanbul.coverageUtils;

    function Blanket(options){
        this.opts = options || {
            reporter: undefined,
            filter: undefined,
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
        this.coverageVariable =  this.opts.coverageVariable || "_$jscoverage";
        this.instrumenter = new istanbul.Instrumenter({
            coverageVariable: this.coverageVariable,
            embedSource: true,
            noCompact: false
        });
        this.events=[];
        this.on("testsDone",this.prepareForReporting);
    }

    Blanket.prototype = {
        instrument: function(code, filename){
            filename = filename || String(new Date().getTime()) + '.js';

            var instrumentedCode =  this.instrumenter.instrumentSync(code,filename);
            //append sourceURL, if applicable
            if (this.opts.flags.sourceURL){
                instrumentedCode += "\n//@ sourceURL="+filename.replace("http://","");
            }
            this.debug("Instrumented file: "+filename);
            return instrumentedCode;
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
        fire: function(eventName){
            var args = Array.prototype.slice.call(arguments).slice(1);
            this.events.forEach(function(ev){
                if (ev.type === eventName){
                    ev.fcn.apply(this,args);
                }
            });
        },
        on: function(eventName,callback,context){
            context = context || this;
            this.events.push({
                type: eventName,
                fcn: function(){
                        return callback.apply(context,arguments);
                }
            });
        },
        
        prepareForReporting: function(){
            istanbulUtils.addDerivedInfo(globalScope[this.coverageVariable]);
            this.fire("showReport",globalScope[this.coverageVariable]);
        },
        
        debug: function(msg){
            if (this.opts.flags.debug){
                (isNode ?
                    require("./common_utils") :
                    Blanket.utils
                ).debug(msg);
            }
        }
    };

    if (isNode) {
        module.exports = Blanket;
    } else {
        globalScope.Blanket = Blanket;
    }
})(typeof window === "undefined",typeof window === "undefined" ? global : window);


