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
    
    var exportables = {
        qualifyURL: qualifyURL,
        loadFile: loadFile,
        addScript: addScript,
        blanketEval: blanketEval
    };

    globalScope.Blanket.DOMUtils = exportables;
})(window);
