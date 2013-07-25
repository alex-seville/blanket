/*
  Blanket.js
  Browser Utils
  Version 2.0
*/

(function(globalScope){
    
    function loadFile(path){
        if (typeof path !== "undefined"){
            var request = new XMLHttpRequest();
            request.open('GET', path, false);
            request.send();
            addScript(request.responseText);
        }
    }

    function addScript(data){
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

    function blanketEval(data){
        addScript(data);
    }

    function parseDataAttributes(){
        var blanketPrefix = "data-blanket",
            blanketFlags = "data-blanket-flags",
            toArray =Array.prototype.slice, //http://stackoverflow.com/a/2954896
            scripts = toArray.call(document.scripts),
            blanketScript,
            attributes,
            dataAttributes={},
            possibleBlanketScripts;

        //we need to find the blanket script.
        //we look for data-blanket
        possibleBlanketScripts = toArray.call(document.querySelectorAll("script["+blanketPrefix+"]"));

        if (possibleBlanketScripts.length === 0){
            //debug("no configs found on the blanket script")
        }else{
            blanketScript = possibleBlanketScripts[0];
            attributes = blanketScript.attributes;
            toArray.call(attributes).forEach(function(s){
                if (s.nodeName.indexOf(blanketPrefix) === 0 &&
                    s.nodeName !== blanketPrefix){
                    if (s.nodeName === blanketFlags){
                        dataAttributes["flags"]={};
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

    
    var exportables = {
        qualifyURL: qualifyURL,
        loadFile: loadFile,
        addScript: addScript,
        blanketEval: blanketEval,
        parseDataAttributes: parseDataAttributes
    };

    globalScope.Blanket.DOMUtils = exportables;
})(window);
