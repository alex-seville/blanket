/**
* Blanket.js
* Adapter manager
* Version 2.0
*
* The core of Blanket
* @module Blanket Core
*/

(function(globalScope){
    var istanbul = globalScope,
        istanbulUtils = istanbul.coverageUtils;

    /**
    *  The core blanket library, handling instrumentation and configuation
    *
    * @class Blanket
    * @constructor
    */

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
        /**
        * Instrument is called to instrument code for coverage
        * We use `istanbul` to instrument the code
        *
        * @method instrument
        * @param {String} code The actual source code
        * @param {String} filename The filename, used for tracking in the instrumentation
        * @return {String} The instrumented code
        */
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
        /**
        * Pass options to the Blanket core
        *
        * @method setOption
        * @param {String} key The option name to set
        * @param {String} val The value
        */
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
        /**
        * Get options set on the Blanket core
        *
        * @method getOption
        * @param {String} key The option name to set
        * @return {String|Boolean} The option value
        */
        getOption: function(key){
            if (this.opts.flags){
               return  this.opts.flags[key] || this.opts[key];
            }
            return this.opts[key];
        },
        /**
        * Fire a blanket event
        *
        * @method fire
        * @param {String} eventName The event name to fire
        */
        fire: function(eventName){
            var args = Array.prototype.slice.call(arguments).slice(1);
            this.events.forEach(function(ev){
                if (ev.type === eventName){
                    ev.fcn.apply(this,args);
                }
            });
        },
        /**
        * Subscribe to a blanket event
        *
        * @method on
        * @param {String} eventName The event name to subscribe to
        * @param {Function} callback The function to call when the event is fired
        * @param {Object} context The context for the callback
        */
        on: function(eventName,callback,context){
            context = context || this;
            this.events.push({
                type: eventName,
                fcn: function(){
                        return callback.apply(context,arguments);
                }
            });
        },
        /**
        * Transform raw instrumentation results into report-ready data
        *
        * @method prepareForReporting
        */
        prepareForReporting: function(){
            istanbulUtils.addDerivedInfo(globalScope[this.coverageVariable]);
            this.fire("showReport",globalScope[this.coverageVariable]);
        },

        /**
        * Used to provide debugging messages
        *
        * @method debug
        * @param {String} msg The debug message to output
        */
        debug: function(msg){
            if (this.opts.flags.debug){
                Blanket.utils.debug(msg);
            }
        },

        /**
        * Used to return the coverage variable
        * We also apply Istanbuls derived information (i.e. mapping back to lines)
        *
        * @method getCoverageVariable
        * @return {Object} The coverage variable
        */
        getCoverageVariable: function(){
            istanbulUtils.addDerivedInfo(globalScope[this.coverageVariable]);
            
            return globalScope[this.coverageVariable];
        }
    };

    globalScope.Blanket = Blanket;
    
})(this);


