/*
  Blanket.js
  Blanket loader
  Version 2.0
*/

(function(globalScope){

    var toArray = Array.prototype.slice;

    function BrowserLoader(blanketInstance,options){
        this.opts = options || {
            collectPageScripts: true,
            preprocessor: function(file){
                Blanket.utils.debug("Default passthrough preprocessor.");
                return file;
            }
        };
        this.blanket = blanketInstance;
        Blanket.utils.debug("Loader initialized.");
    }

    BrowserLoader.prototype = {
        collectPageScripts: function(){
            var scripts = toArray.call(document.scripts),
                selectedScripts=[],
                scriptNames=[],
                matchAlways = this.opts.include,
                matchNever = this.opts.exclude,
                matchPattern = globalScope.Blanket.utils.matchPatternAttribute,
                fullUrl = globalScope.Blanket.DOMUtils.qualifyURL;

            if(typeof matchAlways !== 'undefined'){
                Blanket.utils.debug("Searching loaded script files for a pattern match.");
                selectedScripts = searchAttribute(document.scripts,function(sn){
                                        var url = fullUrl(sn.nodeValue);
                                        return sn.nodeName === "src" && matchPattern(url,matchAlways) &&
                                            (typeof antimatch === "undefined" || !matchPattern(url,matchNever));
                                    });
            }else{
                Blanket.utils.debug("No pattern provided, so searching for data-blanket-cover attributes.");
                selectedScripts = toArray.call(document.querySelectorAll("script[data-blanket-cover]"));
            }
            scriptNames = selectedScripts.map(function(s){
                                    return fullUrl(toArray.call(s.attributes).filter(
                                            function(sn){
                                                return sn.nodeName === "src";
                                            })[0].nodeValue);
                                    });
            Blanket.utils.debug("Returning matched scripts:"+scriptNames);
            return scriptNames;
        },
        loadSourceFiles: function(callback){
            var scripts = this.collectPageScripts(),
                self = this;
            
            if (scripts.length === 0){
                callback();
            }else{
                scripts.forEach(function(file){
                    Blanket.utils.debug("Loading script: "+file);
                    var source = globalScope.Blanket.DOMUtils.loadFile(file);
                    Blanket.utils.debug("Loaded script: "+file);
                    Blanket.utils.debug("Preprocessing and adding to DOM");
                    globalScope.Blanket.DOMUtils.addScript(self.opts.preprocessor(source,file));
                });
                callback();
            }
        }
    };
 
    function searchAttribute(arr,fcn){
        return toArray.call(arr)
                .filter(function(s){
                    return toArray.call(s.attributes).filter(fcn).length === 1;
                });
    }
    
    globalScope.Blanket.browserLoader = BrowserLoader;
})(window);