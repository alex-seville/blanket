/*
  Blanket.js
  Blanket loader
  Version 2.0
*/

(function(isNode,globalScope){

    var toArray = Array.prototype.slice;

    function BrowserLoader(blanketInstance,options){
        this.opts = options || {
            collectPageScripts: true
        };
        this.blanket = blanketInstance;
    }

    BrowserLoader.prototype = {
        clearPending: function(){
            this.pendingFiles=[];
        },
        addPending: function(filename){
            this.pendingFiles.push(filename);
        },
        removePending: function(filename){
            this.pendingFiles.splice(this.pendingFiles.indexOf(filename),1);
        },
        pendingExist: function(){
            return outstandingRequireFiles.length !== 0;
        },
        normalizeBackslashes: function(str) {
            return str.replace(/\\/g, '/');
        },
        collectPageScripts: function(matchAlways,matchNever){
            var scripts = toArray.call(document.scripts),
                selectedScripts=[],
                scriptNames=[];

            if(matchAlways !== null){
                selectedScripts = searchAttribute(document.scripts,function(sn){
                                        return sn.nodeName === "src" && globalScope.Blanket.utils.matchPatternAttribute(sn.nodeValue,matchAlways) &&
                                            (typeof antimatch === "undefined" || !globalScope.Blanket.utils.matchPatternAttribute(sn.nodeValue,matchNever));
                                    });
            }else{
                selectedScripts = toArray.call(document.querySelectorAll("script[data-cover]"));
            }
            scriptNames = selectedScripts.map(function(s){
                                    return globalScope.Blanket.DOMUtils.qualifyURL(
                                        toArray.call(s.attributes).filter(
                                            function(sn){
                                                return sn.nodeName === "src";
                                            })[0].nodeValue);
                                    });
            if (!matchAlways && scriptNames.length > 0){
                this.blanket.setOption("filter",scriptNames);
            }
            return scriptNames;
        }
    };

    function loadSourceFiles(callback){
        // debug "Collecting page scripts");
        var scripts = this.collectPageScripts();
        
        if (scripts.length === 0){
            callback();
        }else{
            scripts.forEach(function(file,indx){   
                _blanket.utils.cache[file]={
                    loaded:false
                };
            });
            
            var currScript=-1;
            loadAll(function(test){
                if (test){
                  return typeof scripts[currScript+1] !== 'undefined';
                }
                currScript++;
                if (currScript >= scripts.length){
                  return null;
                }
                return scripts[currScript];
            },callback);
        }
    }

    function searchAttribute(arr,fcn){
        return toArray.call(arr)
                .filter(function(s){
                    return toArray.call(s.attributes).filter(fcn).length === 1;
                });
    }

    function loadAll(nextScript,cb,preprocessor){
        /**
         * load dependencies
         * @param {nextScript} factory for priority level
         * @param {cb} the done callback
         */
        var currScript=nextScript(),
            isLoaded = _blanket.utils.scriptIsLoaded(
                            currScript,
                            _blanket.utils.ifOrdered,
                            nextScript,
                            cb
                        );
        
        if (!(_blanket.utils.cache[currScript] && _blanket.utils.cache[currScript].loaded)){
            var attach = function(){
                if (_blanket.options("debug")) {console.log("BLANKET-Mark script:"+currScript+", as loaded and move to next script.");}
                isLoaded();
            };
            var whenDone = function(result){
                if (_blanket.options("debug")) {console.log("BLANKET-File loading finished");}
                if (typeof result !== 'undefined'){
                    if (_blanket.options("debug")) {console.log("BLANKET-Add file to DOM.");}
                    _blanket._addScript(result);
                }
                attach();
            };

            _blanket.utils.attachScript(
                {
                    url: currScript
                },
                function (content){
                    _blanket.utils.processFile(
                        content,
                        currScript,
                        whenDone,
                        whenDone
                    );
                }
            );
        }else{
            isLoaded();
        }
    }

    function bindStartTestRunner(bindEvent,startEvent){
        if (bindEvent){
            bindEvent(startEvent);
        }else{
            globalScope.addEventListener("load",startEvent,false);
        }
    }

    function beforeStartTestRunner(opts){
        opts = opts || {};
        opts.callback = opts.callback || function() {  };
        opts.coverage = typeof opts.coverage === "undefined" ? true : opts.coverage;
        
        if (opts.coverage) {
            bindStartTestRunner(opts.bindEvent,
            function(){
                loadSourceFiles(function() {

                    var allLoaded = function(){
                        return opts.condition ? opts.condition() : requireFilesLoaded();
                    };
                    var check = function() {
                        if (allLoaded()) {
                            // debug "All files loaded, init start test runner callback.");}
                            var cb = _blanket.options("testReadyCallback");

                            if (cb){
                                if (typeof cb === "function"){
                                    cb(opts.callback);
                                }else if (typeof cb === "string"){
                                    globalScope.Blanket.DOMUtils.addScript(cb);
                                    opts.callback();
                                }
                            }else{
                                opts.callback();
                            }
                        } else {
                            setTimeout(check, 13);
                        }
                    };
                    check();
                });
            });
        }else{
            opts.callback();
        }
    }


    var exportables = {
        //not sure where these two live
        //loadAdapter: loadFile,
        //loadLoader: loadFile
        beforeStartTestRunner: beforeStartTestRunner
    };

    globalScope.Blanket.browserLoader = exportables;
})(window);