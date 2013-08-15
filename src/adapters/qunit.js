/*
  Blanket.js
  Qunit adapter
  Version 2.0
*/

(function(globalScope){

    function QUnitAdapter(blanketInstance,options){
        this.opts = options || {
        };
        this.blanket = blanketInstance;
        if (typeof globalScope.QUnit === 'undefined'){
            throw new Error("QUnit not found.");
        }
        this.disable();
        QUnit.config.urlConfig.push({
            id: "coverage",
            label: "Enable coverage",
            tooltip: "Enable code coverage."
        });
        Blanket.utils.debug("QUnit adapter initialized.");
    }

    QUnitAdapter.prototype = {
        disable: function(){
            globalScope.QUnit.config.autostart = false;
        },
        start: function(){
            QUnit.start();
        }
    };

    

    
    globalScope.Blanket.QUnitAdapter = QUnitAdapter;
})(window);