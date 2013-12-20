/*
  Blanket.js
  Requirejs loader
  Version 2.0
*/

(function(globalScope) {

    var toArray = Array.prototype.slice;

    function bind(obj, fn) {
        return function() {
            return fn.apply(obj, arguments);
        };
    }

    var globalRequirejsLoad = requirejs.load,
        Blanket = globalScope.Blanket,
        matchPattern = Blanket.utils.matchPatternAttribute,
        matchAlways = Blanket.blanketSingleton.getOption("include"),
        matchNever = Blanket.blanketSingleton.getOption("exclude"),
        preprocess = Blanket.blanketSingleton.getOption("preprocessor");

    Blanket.utils.debug("Setting up blanket requirejs loader");


    requirejs.load = function(context, moduleName, url) {
        
        if (matchPattern(url, matchAlways) && !matchPattern(url, matchNever)) {
            Blanket.utils.debug("RequireJS Loader loading script: " + url);
            var source = globalScope.Blanket.DOMUtils.loadFile(url);
            Blanket.utils.debug("RequireJS Loader loaded script: " + url);
            Blanket.utils.debug("RequireJS Loader preprocessing and adding to DOM");
            globalScope.Blanket.DOMUtils.addScript(preprocess(source, url));
            context.completeLoad(moduleName);
        } else {
            Blanket.utils.debug("Delegating script to normal requirejs loader: " + url);
            globalRequirejsLoad(context, moduleName, url);
        }
    };

})(window);