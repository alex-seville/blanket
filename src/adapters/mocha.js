/*
  Blanket.js
  Mocha adapter
  Version 2.0
*/

(function(globalScope){

    function MochaAdapter(blanketInstance,options){
        var originalReporter,
            blanketReporter;

        this.opts = options || {
        };
        this.blanket = blanketInstance;
        if (typeof globalScope.mocha === 'undefined'){
            throw new Error("Mocha not found.");
        }
        this.disable();
        originalReporter = mocha._reporter;
        blanketReporter = function(runner) {
            runner.on('test end', function() {
                blanketInstance.fire("testsDone");
            });
            runner.globals([
                'stats',
                'failures',
                'runner',
                //these items should be removed when the reporter is fixed
                'grandTotalTemplate',
                'blanket_toggleSource'
            ]);
            originalReporter(runner);
        };
        mocha.reporter(blanketReporter);
        Blanket.utils.debug("Mocha adapter initialized.");
    }

    MochaAdapter.prototype = {
        disable: function(){
            this.oldRun = mocha.run;
            mocha.run = function (finishCallback) {
              this.oldCallback = finishCallback;
              Blanket.utils.debug("Overiding Mocha execution.");
            };
        },
        start: function(){
            this.oldRun(this.oldCallback);
            Blanket.utils.debug("Executing Mocha");
            mocha.run = this.oldRun;
        }
    };

    globalScope.Blanket.MochaAdapter = MochaAdapter;
    globalScope.Blanket.adapterManagerSingleton.attachAdapter(
        new MochaAdapter(globalScope.Blanket.blanketSingleton)
    );
})(window);