/*
  Blanket.js
  Blanket index
  Version 2.0
*/

(function(isNode,globalScope){
    var blanket,loader;

    blanket = new Blanket();
    if (!isNode){
        loader = new BrowserLoader(blanket);
    }

})(typeof window === "undefined",typeof window === "undefined" ? global : window);