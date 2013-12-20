/*
  Blanket.js
  Adapter manager
  Version 2.0
*/

(function(globalScope){

    function AdapterManager(blanketInstance,options){
        this.opts = options || {
        };
        this.blanket = blanketInstance;
        this.adapters=[];
        Blanket.utils.debug("Adapter manager initialized.");
    }

    AdapterManager.prototype = {
        attachAdapter: function(adapter){
            this.adapters.push(adapter);
        },
        start: function(){
            this.adapters.forEach(function(adapter){
                adapter.start();
            });
        }
    };

   
    globalScope.Blanket.adapterManager = AdapterManager;
})(window);