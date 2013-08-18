/*
  Blanket.js
  Browser Utils
  Version 2.0
*/

(function(globalScope){
    
    function loadFile(path,callback){
        if (typeof path !== "undefined"){
            var request = new XMLHttpRequest();
            request.open('GET', path, false);
            request.send();
            return request.responseText;
        }
    }

    function addScript(data){
        Blanket.utils.debug("Adding script to DOM");
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.text = data;
        (document.body || document.getElementsByTagName('head')[0]).appendChild(script);
    }

    function qualifyURL(url) {
        //http://stackoverflow.com/questions/470832/getting-an-absolute-url-from-a-relative-one-ie6-issue
        var a = document.createElement('a');
        a.href = url;
        return a.href;
    }

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
