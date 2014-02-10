/*
  Blanket.js
  Browser Utils
  Version 2.0

  Utility functions for interacting with the DOM
*/

(function(globalScope){
    
    /**
    * Load a url using a synchornous XHR
    *
    * @method loadFile
    * @param {String} path The path to the file (normally a URL)
    */
    function loadFile(path){
        if (typeof path !== "undefined"){
            var request = new XMLHttpRequest();
            request.open('GET', path, false);
            request.send();
            return request.responseText;
        }
    }

    /**
    * Attach a script element to the DOM
    * No data validation is done.  We assume the source passed is valid JavaScript
    *
    * @method addScript
    * @param {String} data The JavaScript to attach to the page
    */
    function addScript(data){
        Blanket.utils.debug("Adding script to DOM");
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.text = data;
        (document.body || document.getElementsByTagName('head')[0]).appendChild(script);
    }

    /**
    * Use the DOM to generate a complete URL
    *
    * @method qualifyURL
    * @param {String} url The URL to be "qualified"
    * @return {String} The qualified URL
    */
    function qualifyURL(url) {
        //http://stackoverflow.com/questions/470832/getting-an-absolute-url-from-a-relative-one-ie6-issue
        var a = document.createElement('a');
        a.href = url;
        return a.href;
    }

    /**
    * Parse Blanket related data-attributes from the DOM
    * Used to identfy Blanket options and identify the Blanket script reference
    *
    * @method parseDataAttributes
    * @return {Object} An object representing all the Blanket related data-attributes found in the DOM
    */
    function parseDataAttributes(){
        var blanketPrefix = "data-blanket",
            blanketFlags = blanketPrefix+"-flags",
            toArray =Array.prototype.slice, //http://stackoverflow.com/a/2954896
            scripts = toArray.call(document.scripts),
            blanketScript,
            attributes,
            dataAttributes={
                flags: {}
            },
            possibleBlanketScripts;

        //we need to find the blanket script.
        //we look for data-blanket
        possibleBlanketScripts = toArray.call(document.querySelectorAll("script["+blanketPrefix+"]"));

        if (possibleBlanketScripts.length === 0){
            Blanket.utils.debug("No blanket script detected, so no config options parsed.");
        }else{
            blanketScript = possibleBlanketScripts[0];
            attributes = blanketScript.attributes;
            toArray.call(attributes).forEach(function(s){
                if (s.nodeName.indexOf(blanketPrefix) === 0 &&
                    s.nodeName !== blanketPrefix){
                    if (s.nodeName === blanketFlags){
                        s.nodeValue.split(" ").forEach(function(flag){
                            dataAttributes["flags"][flag]=true;
                        });
                    }else{
                        dataAttributes[s.nodeName.substring(blanketPrefix.length+1)] = s.nodeValue;
                    }
                }  
            });
        }
        return dataAttributes;
    }

    /**
    * Find all scripts tagged with the `data-blanket-cover` attribute
    *
    * @method parseCoveredFiles
    * @return {Array} An array containing all the HTML Script elements decorated with the `data-blanket-cover` attribute
    */
    function parseCoveredFiles(){
        var blanketPrefix = "data-blanket",
            blanketToCover = blanketPrefix+"-cover",
            toArray =Array.prototype.slice;
      
        return toArray.call(document.querySelectorAll("script["+blanketToCover+"]"));
    }

    
    var exportables = {
        qualifyURL: qualifyURL,
        loadFile: loadFile,
        addScript: addScript,
        parseDataAttributes: parseDataAttributes,
        parseCoveredFiles: parseCoveredFiles
    };

    globalScope.Blanket.DOMUtils = exportables;
})(window);
