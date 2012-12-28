(function(){
    var globalFilter,customReporter,adapter,
        order=true,coffeescript=false,
        ignoreScriptError=false;
    //http://stackoverflow.com/a/2954896
    var toArray =Array.prototype.slice;
    var scripts = toArray.call(document.scripts);
    toArray.call(scripts[scripts.length - 1].attributes)
                    .forEach(function(es){
                        if(es.nodeName === "data-cover-only"){
                            globalFilter = es.nodeValue;
                        }
                        if(es.nodeName === "data-cover-reporter"){
                            customReporter = es.nodeValue;
                        }
                        if (es.nodeName === "data-cover-adapter"){
                            adapter = es.nodeValue;
                        }
                        if (es.nodeName === "data-cover-unordered"){
                            order = false;
                        }
                        if (es.nodeName === "data-cover-cs") {
                            coffeescript = true;
                        }
                        if (es.nodeName === "data-cover-ignore-error"){
                            ignoreScriptError = true;
                        }
                    });
    blanket.setFilter(globalFilter);
    blanket.setReporter(customReporter);
    blanket.setAdapter(adapter);
    blanket.setOrdered(order);
    blanket.setCoffeeScript(coffeescript);
    blanket.setIgnoreScriptError(ignoreScriptError);
})();