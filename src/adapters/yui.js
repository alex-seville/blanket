/*
  Blanket.js
  YUI adapter
  Version 2.0
*/

(function(globalScope){

    function YUIAdapter(blanketInstance,options){
        var self = this;

        this.opts = options || {
        };
        this.blanket = blanketInstance;
        if (typeof YUI === 'undefined' ){
            throw new Error("YUI not found.");
        }
        
        YUI.add('blanket', function (Y) {
            var TestRunner = Y.Test.Runner;

            TestRunner.subscribe(TestRunner.COMPLETE_EVENT,function(data){
                self.blanket.fire("testsDone");
            });
        },'0.0.1',{
            requires :['test']
        });

        Blanket.utils.debug("YUI adapter initialized.");
    }

    YUIAdapter.prototype = {
        start: function(){
            this.blanket.fire("startAdapter");
        }
    };
    
    globalScope.Blanket.YUIAdapter = YUIAdapter;
    globalScope.Blanket.adapterManagerSingleton.attachAdapter(
        new YUIAdapter(globalScope.Blanket.blanketSingleton)
    );
})(window);