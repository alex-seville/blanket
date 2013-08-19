/*
  Blanket.js
  Blanket index
  Version 2.0
*/

(function(isNode,globalScope){
    var blanket,loader,adapter;

    blanket = new Blanket();
    if (!isNode){
        var settingsFromDOM = Blanket.DOMUtils.parseDataAttributes();
        if (settingsFromDOM.flags && settingsFromDOM.flags.debug){
            Blanket.utils.enableDebug();
        }
        settingsFromDOM.preprocessor = function(code,name){
            return blanket.instrument(code,name);
        };
        blanket.setOption(settingsFromDOM);
        loader = new Blanket.browserLoader(blanket,settingsFromDOM);
        adapterManager = new Blanket.adapterManager(blanket);
        globalScope.Blanket.adapterManagerSingleton = adapterManager;
        globalScope.Blanket.blanketSingleton = blanket;

        blanket.on("showReport",function(){
            if (window._$jscoverage){
                window.defaultReporter(window._$jscoverage);
            }else{
                Blanket.utils.debug("No coverage data.");
            }
        });
        window.onload = function(){
            var scriptsToInstrument = loader.loadSourceFiles(function(){
                adapterManager.start();
            });
        };
    }

})(typeof window === "undefined",typeof window === "undefined" ? global : window);