(function(_blanket){
_blanket.extend({
    utils: {
        normalizeBackslashes: function(str) {
            return str.replace(/\\/g, '/');
        },
        matchPatternAttribute: function(filename,pattern){
            if (typeof pattern === 'string'){
                if (pattern.indexOf("[") === 0){
                    //treat as array
                    var pattenArr = pattern.slice(1,pattern.length-1).split(",");
                    return pattenArr.some(function(elem){
                        return _blanket.utils.matchPatternAttribute(filename,_blanket.utils.normalizeBackslashes(elem.slice(1,-1)));
                        //return filename.indexOf(_blanket.utils.normalizeBackslashes(elem.slice(1,-1))) > -1;
                    });
                }else if ( pattern.indexOf("//") === 0){
                    var ex = pattern.slice(2,pattern.lastIndexOf('/'));
                    var mods = pattern.slice(pattern.lastIndexOf('/')+1);
                    var regex = new RegExp(ex,mods);
                    return regex.test(filename);
                }else if (pattern.indexOf("#") === 0){
                    return window[pattern.slice(1)].call(window,filename);
                }else{
                    return filename.indexOf(_blanket.utils.normalizeBackslashes(pattern)) > -1;
                }
            }else if ( pattern instanceof Array ){
                return pattern.some(function(elem){
                    return _blanket.utils.matchPatternAttribute(filename,elem);
                });
            }else if (pattern instanceof RegExp){
                return pattern.test(filename);
            }else if (typeof pattern === "function"){
                return pattern.call(window,filename);
            }
        },
        blanketEval: function(data){
            _blanket._addScript(data);
        },
        collectPageScripts: function(){
            var toArray = Array.prototype.slice;
            var scripts = toArray.call(document.scripts);
            var selectedScripts=[],scriptNames=[];
            var filter = _blanket.options("filter");
            if(filter != null){
                //global filter in place, data-cover-only
                var antimatch = _blanket.options("antifilter");
                selectedScripts = toArray.call(document.scripts)
                                .filter(function(s){
                                    return toArray.call(s.attributes).filter(function(sn){
                                        return sn.nodeName === "src" && _blanket.utils.matchPatternAttribute(sn.nodeValue,filter) &&
                                            (typeof antimatch === "undefined" || !_blanket.utils.matchPatternAttribute(sn.nodeValue,antimatch));
                                    }).length === 1;
                                });
            }else{
                selectedScripts = toArray.call(document.querySelectorAll("script[data-cover]"));
            }
            scriptNames = selectedScripts.map(function(s){
                                    return _blanket.utils.qualifyURL(
                                        toArray.call(s.attributes).filter(
                                            function(sn){
                                                return sn.nodeName === "src";
                                            })[0].nodeValue).replace(".js","");
                                    });
            if (!filter){
                _blanket.options("filter","['"+scriptNames.join("','")+"']");
            }
            return scriptNames;
        },
        loadAll: function(nextScript,cb){
            /**
             * load dependencies
             * @param {nextScript} factory for priority level
             * @param {cb} the done callback
             */
            var currScript=nextScript();
            
            if (!(_blanket.utils.cache[currScript] && _blanket.utils.cache[currScript].loaded)){
                _blanket.utils.attachScript(
                    {url: currScript},
                    _blanket.utils.scriptIsLoaded(
                        currScript,
                        _blanket.utils.ifOrdered,
                        nextScript,
                        cb
                    )
                );
            }else{
                _blanket.utils.scriptIsLoaded(
                    currScript,
                    _blanket.utils.ifOrdered,
                    nextScript,
                    cb
                )();
            }
        },
        attachScript: function(options,cb){
            /**
           * Attaches a script to the DOM and executes it.
           * @param {options} object, normally with .url
           * @param {cb} callback, called when script is loaded
           */
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = options.url;
            script.onload = cb;
            script.onerror = function(){ throw new Error("error loading source script");};
            (document.head || document.getElementsByTagName('head')[0]).appendChild(script);
        },
        ifOrdered: function(nextScript,cb){
            /**
             * ordered loading callback
             * @param {nextScript} factory for priority level
             * @param {cb} the done callback
             */
            var currScript = nextScript(true);
            if (currScript){
              _blanket.utils.loadAll(nextScript,cb);
            }else{
              cb(new Error("Error in loading chain."));
            }
        },
        scriptIsLoaded: function(url,orderedCb,nextScript,cb){
            /**
           * returns a callback that checks a loading list to see if a script is loaded.
           * @param {orderedCb} callback if ordered loading is being done
           * @param {nextScript} factory for next priority level
           * @param {cb} the done callback
           */
            return function(){
                _blanket.utils.cache[url].loaded=true;
            
                if (_blanket.utils.allLoaded()){
                    cb();
                }else if (_blanket.utils.orderedCb){
                    //if it's ordered we need to
                    //traverse down to the next
                    //priority level
                    _blanket.utils.orderedCb(nextScript,cb);
                }
            };
        },
        cache: {},
        allLoaded: function (){
            /**
             * check if depdencies are loaded in cache
             */
            var cached = Object.keys(_blanket.utils.cache);
            for (var i=0;i<cached.length;i++){
                if (!_blanket.utils.cache[cached[i]].loaded){
                    return false;
                }
            }
            return true;
        }
    }
});
(function(){
    var require = blanket.options("commonJS") ? blanket._commonjs.require : window.require;
    var requirejs = blanket.options("commonJS") ? blanket._commonjs.requirejs : window.requirejs;
    if (!_blanket.options("engineOnly")){

        _blanket.utils.oldloader = requirejs.load;

        requirejs.load = function (context, moduleName, url) {
            _blanket.requiringFile(url);
            requirejs.cget(url, function (content) {

                var match = _blanket.options("filter");
                //we check the never matches first
                var antimatch = _blanket.options("antifilter");
                if (typeof antimatch !== "undefined" &&
                        _blanket.utils.matchPatternAttribute(url.replace(/\.js$/,""),antimatch)
                    ){
                    _blanket.utils.oldloader(context, moduleName, url);
                    if (_blanket.options("debug")) {console.log("BLANKET-File will never be instrumented:"+url);}
                    _blanket.requiringFile(url,true);
                }else if (_blanket.utils.matchPatternAttribute(url.replace(/\.js$/,""),match)){
                    if (_blanket.options("debug")) {console.log("BLANKET-Attempting instrument of:"+url);}
                    _blanket.instrument({
                        inputFile: content,
                        inputFileName: url
                    },function(instrumented){
                        try{
                            _blanket.utils.blanketEval(instrumented);
                            context.completeLoad(moduleName);
                            _blanket.requiringFile(url,true);
                        }
                        catch(err){
                            if (_blanket.options("ignoreScriptError")){
                                //we can continue like normal if
                                //we're ignoring script errors,
                                //but otherwise we don't want
                                //to completeLoad or the error might be
                                //missed.
                                if (_blanket.options("debug")) { console.log("BLANKET-There was an error loading the file:"+url); }
                                context.completeLoad(moduleName);
                                _blanket.requiringFile(url,true);
                            }else{
                                throw new Error("Error parsing instrumented code: "+err);
                            }
                        }
                    });
                }else{
                    if (_blanket.options("debug")) { console.log("BLANKET-Loading (without instrumenting) the file:"+url);}
                    _blanket.utils.oldloader(context, moduleName, url);
                    _blanket.requiringFile(url,true);
                }

            }, function (err) {
                _blanket.requiringFile();
                throw err;
            });
        };


        requirejs.createXhr = function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        };


        requirejs.cget = function (url, callback, errback, onXhr) {
            var foundInSession = false;
            if (_blanket.blanketSession){
                var files = Object.keys(_blanket.blanketSession);
                for (var i=0; i<files.length;i++ ){
                    var key = files[i];
                    if (url.indexOf(key) > -1){
                        callback(_blanket.blanketSession[key]);
                        foundInSession=true;
                        return;
                    }
                }
            }
            if (!foundInSession){
                var xhr = requirejs.createXhr();
                xhr.open('GET', url, true);

                //Allow overrides specified in config
                if (onXhr) {
                    onXhr(xhr, url);
                }

                xhr.onreadystatechange = function (evt) {
                    var status, err;
                    
                    //Do not explicitly handle errors, those should be
                    //visible via console output in the browser.
                    if (xhr.readyState === 4) {
                        status = xhr.status;
                        if ((status > 399 && status < 600) /*||
                            (status === 0 &&
                                navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
                           */ ) {
                            //An http 4xx or 5xx error. Signal an error.
                            err = new Error(url + ' HTTP status: ' + status);
                            err.xhr = xhr;
                            errback(err);
                        } else {
                            callback(xhr.responseText);
                        }
                    }
                };
                try{
                    xhr.send(null);
                }catch(e){
                    if (e.code && (e.code === 101 || e.code === 1012) && _blanket.options("ignoreCors") === false){
                        //running locally and getting error from browser
                        _blanket.showManualLoader();
                    } else {
                        throw e;
                    }
                }
            }
        };
    }
})();
})(blanket);
