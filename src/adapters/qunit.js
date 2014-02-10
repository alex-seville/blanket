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
        var adapter = this;

        this.blanket = blanketInstance;

        this.opts = options || {
        };
        
        if (typeof globalScope.QUnit === 'undefined'){
            throw new Error("QUnit not found.");
        }
        this.disable();
        //detect QUnit version
        if (this.isEarlyQUnit()){
            this.bindEarlyQunit();
        }else{
            this.bindCurrentQunit();
        }
        Blanket.utils.debug("QUnit adapter initialized.");
    }

    QUnitAdapter.prototype = {
        /**
        * Bind early QUnit
        *
        * @method bindEarlyQunit
        */
        bindEarlyQunit: function(){
            //older versions we run coverage automatically
            QUnit.config.urlConfig.push("coverage");
            if (QUnit.urlParams.coverage) {
                QUnit.done = this.onEnd.bind(this);
            }
        },

        /**
        * Bind current QUnit
        *
        * @method bindCurrentQunit
        */
        bindCurrentQunit: function(){
            QUnit.config.urlConfig.push({
                id: "coverage",
                label: "Enable coverage",
                tooltip: "Enable code coverage."
            });
            if (QUnit.urlParams.coverage) {
                QUnit.done(this.onEnd.bind(this));
            }
        },

        /**
        * Detect early QUnit
        *
        * @method isEarlyQUnit
        * @return Early QUnit state
        */
        isEarlyQUnit: function(){
            return !QUnit.config.urlConfig[0].tooltip;
        },

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
        },
        onEnd: function(failures, total){
            this.blanket.fire("testsDone");
        }
    };
    
    globalScope.Blanket.QUnitAdapter = QUnitAdapter;
    globalScope.Blanket.adapterManagerSingleton.attachAdapter(
        new QUnitAdapter(globalScope.Blanket.blanketSingleton)
    );
})(window);