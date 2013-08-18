/*
  Blanket.js
  Jasmine adapter
  Version 2.0
*/

(function(globalScope){
    var JASMINE = 'jasmine';

    function JasmineAdapter(blanketInstance,options){
        this.opts = options || {
            jasmine: JASMINE
        };
        this.blanket = blanketInstance;
        if (typeof this.opts[JASMINE] === 'undefined' ||
            typeof globalScope[JASMINE] === 'undefined'){
            throw new Error("Jasmine not found.");
        }
        if (this.opts.executeAfter){
            this.disable();
        }
        globalScope[JASMINE].getEnv().addReporter(this);
        Blanket.utils.debug("Jasmine adapter initialized.");
    }

    JasmineAdapter.prototype = {
        disable: function(){
            globalScope[JASMINE].getEnv().execute = function(){
                Blanket.utils.debug("Overiding Jasmine execution.");
            };
        },
        start: function(){
            if (this.opts.executeAfter){  
                Blanket.utils.debug("Executing Jasmine");
                globalScope[JASMINE].getEnv().execute = function () {
                    globalScope[JASMINE].getEnv().currentRunner().execute();
                };
                globalScope[JASMINE].getEnv().execute();
            }
        },
        reportRunnerResults: function(){
            this.blanket.fire("testsDone");
        },
        log: function(str) {
            Blanket.utils.debug(str);
        }
    };
    
    globalScope.Blanket.JasmineAdapter = JasmineAdapter;
    globalScope.Blanket.adapterManagerSingleton.attachAdapter(
        new JasmineAdapter(globalScope.Blanket.blanketSingleton)
    );
})(window);