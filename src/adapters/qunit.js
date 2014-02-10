/**
* Blanket.js
* QUnit Adapter
* Version 2.0
*
* Adapt Blanket to the QUnit test framework
* @module QUnit Adapter
*/

(function(globalScope){

    /**
    *  Adapt Blanket to the QUnit test framework
    *
    * @class QUnitAdapter
    * @constructor
    */
    function QUnitAdapter(blanketInstance,options){
        this.opts = options || {
        };
        this.blanket = blanketInstance;
        if (typeof globalScope.QUnit === 'undefined'){
            throw new Error("QUnit not found.");
        }
        this.disable();
        //detect QUnit version
        if (!QUnit.config.urlConfig[0].tooltip){
            //older versions we run coverage automatically
            QUnit.config.urlConfig.push("coverage");
            if (QUnit.urlParams.coverage) {
                QUnit.done=function(failures, total) {
                    blanketInstance.fire("testsDone");
                };
            }
        }else{
            QUnit.config.urlConfig.push({
                id: "coverage",
                label: "Enable coverage",
                tooltip: "Enable code coverage."
            });
            if (QUnit.urlParams.coverage) {
                QUnit.done(function(failures, total) {
                    blanketInstance.fire("testsDone");
                });
            }
        }
        Blanket.utils.debug("QUnit adapter initialized.");
    }

    QUnitAdapter.prototype = {
        /**
        * Suppress QUnit autostart function to allow source files to be instrumented first
        *
        * @method disable
        */
        disable: function(){
            globalScope.QUnit.config.autostart = false;
        },
        /**
        * Start the QUnit test framework
        *
        * @method start
        */
        start: function(){
            QUnit.start();
        }
    };
    
    globalScope.Blanket.QUnitAdapter = QUnitAdapter;
    globalScope.Blanket.adapterManagerSingleton.attachAdapter(
        new QUnitAdapter(globalScope.Blanket.blanketSingleton)
    );
})(window);