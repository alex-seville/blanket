/*
  Blanket.js
  Blanket index
  Version 2.0
*/

(function(isNode,globalScope){
    var blanket,loader;

    blanket = new Blanket();
    if (!isNode){
        var settingsFromDOM = Blanket.DOMUtils.parseDataAttributes();
        if (settingsFromDOM.flags && settingsFromDOM.flags.debug){
            Blanket.utils.enableDebug();
        }
        settingsFromDOM.preprocessor = function(file){
            Blanket.utils.debug("Custom preprocessor");
            return "window.TEST='test';\n"+file;
        };
        loader = new Blanket.browserLoader(blanket,settingsFromDOM);
        window.onload = function(){
            var scriptsToInstrument = loader.loadSourceFiles(function(){
                console.log("LOADED");
            });
        }
    }

})(typeof window === "undefined",typeof window === "undefined" ? global : window);