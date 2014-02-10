/*
  Blanket.js
  Adapter manager
  Version 2.0

  Manage Blanket test runner and test dependency adapters
*/

(function(globalScope){

    /**
    *  The adapterManager manages adapters for test frameworks
    *
    * @class AdapterManager
    * @constructor
    * @param {Object} blanketInstance The instance of Blanket the adapterManager should be associated with
    * @param {Object} options A hash of adapterManager options
    */

    function AdapterManager(blanketInstance,options){
        this.opts = options || {
        };
        this.blanket = blanketInstance;
        this.adapters=[];
        Blanket.utils.debug("Adapter manager initialized.");
    }

    AdapterManager.prototype = {
        /**
        * Attach a test adapter to the adapterManager
        *
        * @method attachAdapter
        * @param {Object} adapter The adapter to attach
        */
        attachAdapter: function(adapter){
            this.adapters.push(adapter);
        },
        /**
        * Start the adapters (usually binds the test framework to Blanket)
        *
        * @method start
        */
        start: function(){
            this.adapters.forEach(function(adapter){
                adapter.start();
            });
        }
    };

   
    globalScope.Blanket.adapterManager = AdapterManager;
})(window);