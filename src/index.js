/**
* Blanket.js
* Blanket Index
* Version 2.0
*
* Configure Blanket to run in a browser environment
* @module Blanket Index
*/

(function(globalScope){
    var blanket,loader,adapter;

    blanket = globalScope.blanket = new Blanket();
    
    var settingsFromDOM = Blanket.DOMUtils.parseDataAttributes();
    settingsFromDOM.flags = settingsFromDOM.flags || {};

    if (settingsFromDOM.flags.debug){
        Blanket.utils.enableDebug();
    }
    settingsFromDOM.preprocessor = function(code,name){
        return blanket.instrument(code,name);
    };
    //check the querystring for threshold parameter
    settingsFromDOM.flags.threshold = globalScope.Blanket.DOMUtils.getParameterByName('threshold');

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

})(this);