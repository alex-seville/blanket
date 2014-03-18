(function(_blanket) {

    _blanket.extend({

        utils: {

            normalizeBackslashes: function(str) {
                return str.replace(/\\/g, '/');
            },

            matchPatternAttribute: function(filename, pattern) {
                if (typeof pattern === 'string') {
                    if (pattern.indexOf("[") === 0) {
                        // treat as array
                        var pattenArr = pattern.slice(1, pattern.length - 1).split(",");
                        return pattenArr.some(function(elem) {
                            return _blanket.utils.matchPatternAttribute(filename, _blanket.utils.normalizeBackslashes(elem.slice(1, -1)));
                        });
                    } else if (pattern.indexOf("//") === 0) {
                        var ex = pattern.slice(2, pattern.lastIndexOf('/')),
                            mods = pattern.slice(pattern.lastIndexOf('/') + 1),
                            regex = new RegExp(ex, mods);
                        return regex.test(filename);
                    } else if (pattern.indexOf("#") === 0) {
                        return window[pattern.slice(1)].call(window, filename);
                    } else {
                        return filename.indexOf(_blanket.utils.normalizeBackslashes(pattern)) > -1;
                    }
                } else if (pattern instanceof Array) {
                    return pattern.some(function(elem) {
                        return _blanket.utils.matchPatternAttribute(filename, elem);
                    });
                } else if (pattern instanceof RegExp) {
                    return pattern.test(filename);
                } else if (typeof pattern === "function") {
                    return pattern.call(window, filename);
                }
            },

            blanketEval: function(data) {
                _blanket._addScript(data);
            },

            filter: function(scripts) {
                var toArray = Array.prototype.slice,
                    match = _blanket.options("filter"),
                    antiMatch = _blanket.options("antifilter");

                return toArray.call(scripts).filter(function(script) {
                    return _blanket.utils.matchPatternAttribute(script.src, match) &&
                        (typeof antiMatch === "undefined" || !_blanket.utils.matchPatternAttribute(script.src, antiMatch));
                });
            },

            collectPageScripts: function() {
                var toArray = Array.prototype.slice,
                    selectedScripts = [],
                    scriptNames = [],
                    filter = _blanket.options("filter");

                selectedScripts = filter ?
                    this.filter(toArray.call(document.scripts)) :
                    toArray.call(document.querySelectorAll("script[data-cover]"));

                scriptNames = selectedScripts.map(function(s) {
                    return _blanket.utils.qualifyURL(
                        toArray.call(s.attributes).filter(function(sn) {
                            return sn.nodeName === "src";
                        })[0].value);
                });

                return scriptNames;
            },

            loadAll: function(nextScript, cb, preprocessor) {
                /**
                 * load dependencies
                 * @param {nextScript} factory for priority level
                 * @param {cb} the done callback
                 */
                var currScript = nextScript(),
                    isLoaded = _blanket.utils.scriptIsLoaded(
                        currScript,
                        _blanket.utils.ifOrdered,
                        nextScript,
                        cb
                    );

                if (!_blanket.utils.cache[currScript]) {
                    var attach = function() {
                        if (_blanket.options("debug")) {
                            console.log("BLANKET-Mark script:" + currScript + ", as loaded and move to next script.");
                        }

                        isLoaded();
                    };
                    var whenDone = function(result) {
                        if (_blanket.options("debug")) {
                            console.log("BLANKET-File loading finished");
                        }

                        if (typeof result !== 'undefined') {
                            if (_blanket.options("debug")) {
                                console.log("BLANKET-Add file to DOM.");
                            }
                            _blanket._addScript(result);
                        }

                        attach();
                    };

                    _blanket.utils.attachScript({
                            url: currScript
                        },
                        function(content) {
                            _blanket.utils.processFile(
                                content,
                                currScript,
                                whenDone,
                                whenDone
                            );
                        }
                    );
                } else {
                    isLoaded();
                }
            },

            attachScript: function(options, cb) {
                _blanket.utils.getFile(options.url, cb, function(error) {
                    throw new Error("error loading source script " + error);
                });
            },

            ifOrdered: function(nextScript, cb) {
                /**
                 * ordered loading callback
                 * @param {nextScript} factory for priority level
                 * @param {cb} the done callback
                 */

                var currScript = nextScript(true);

                if (currScript) {
                    _blanket.utils.loadAll(nextScript, cb);
                } else {
                    cb(new Error("Error in loading chain."));
                }
            },

            scriptIsLoaded: function(url, orderedCb, nextScript, cb) {
                /**
                 * returns a callback that checks a loading list to see if a script is loaded.
                 * @param {orderedCb} callback if ordered loading is being done
                 * @param {nextScript} factory for next priority level
                 * @param {cb} the done callback
                 */

                if (_blanket.options("debug")) {
                    console.log("BLANKET-Returning function");
                }

                return function() {
                    if (_blanket.options("debug")) {
                        console.log("BLANKET-Marking file as loaded: " + url);
                    }

                    if (_blanket.utils.allLoaded()) {
                        if (_blanket.options("debug")) {
                            console.log("BLANKET-All files loaded");
                        }

                        cb();
                    } else if (orderedCb) {
                        // if it's ordered we need to
                        // traverse down to the next
                        // priority level
                        if (_blanket.options("debug")) {
                            console.log("BLANKET-Load next file.");
                        }

                        orderedCb(nextScript, cb);
                    }
                };
            },

            cache: {},

            allLoaded: function() {
                /**
                 * check if depdencies are loaded in cache
                 */
                var cached = Object.keys(_blanket.utils.cache);

                for (var i = 0; i < cached.length; i++) {
                    if (!_blanket.utils.cache[cached[i]]) {
                        return false;
                    }
                }

                return true;
            },

            processFile: function(content, url, cb, oldCb) {
                var match = _blanket.options("filter"),
                    antimatch = _blanket.options("antifilter"); // we check the never matches first

                if (typeof antimatch !== "undefined" && _blanket.utils.matchPatternAttribute(url, antimatch)) {
                    oldCb(content);

                    if (_blanket.options("debug")) {
                        console.log("BLANKET-File will never be instrumented:" + url);
                    }

                    _blanket.requiringFile(url, true);
                } else if (_blanket.utils.matchPatternAttribute(url, match)) {
                    if (_blanket.options("debug")) {
                        console.log("BLANKET-Attempting instrument of:" + url);
                    }

                    _blanket.instrument({
                        inputFile: content,
                        inputFileName: url
                    }, function(instrumented) {
                        try {
                            if (_blanket.options("debug")) {
                                console.log("BLANKET-instrument of:" + url + " was successfull.");
                            }

                            _blanket.utils.blanketEval(instrumented);
                            cb();
                            _blanket.requiringFile(url, true);
                        } catch (err) {
                            if (_blanket.options("ignoreScriptError")) {
                                // we can continue like normal if
                                // we're ignoring script errors,
                                // but otherwise we don't want
                                // to completeLoad or the error might be
                                // missed.
                                if (_blanket.options("debug")) {
                                    console.log("BLANKET-There was an error loading the file:" + url);
                                }

                                cb(content);
                                _blanket.requiringFile(url, true);
                            } else {
                                throw new Error("Error parsing instrumented code: " + err);
                            }
                        }
                    });
                } else {
                    if (_blanket.options("debug")) {
                        console.log("BLANKET-Loading (without instrumenting) the file:" + url);
                    }

                    oldCb(content);
                    _blanket.requiringFile(url, true);
                }
            },

            cacheXhrConstructor: function() {
                var Constructor, createXhr, i, progId;

                if (typeof XMLHttpRequest !== "undefined") {
                    Constructor = XMLHttpRequest;
                    this.createXhr = function() {
                        return new Constructor();
                    };
                } else if (typeof ActiveXObject !== "undefined") {
                    Constructor = ActiveXObject;

                    for (i = 0; i < 3; i += 1) {
                        progId = progIds[i];
                        try {
                            new ActiveXObject(progId);
                            break;
                        } catch (e) {}
                    }
                    this.createXhr = function() {
                        return new Constructor(progId);
                    };
                }
            },

            craeteXhr: function() {
                throw new Error("cacheXhrConstructor is supposed to overwrite this function.");
            },

            getFile: function(url, callback, errback, onXhr) {
                var foundInSession = false;

                if (_blanket.blanketSession) {
                    var files = Object.keys(_blanket.blanketSession);
                    for (var i = 0; i < files.length; i++) {
                        var key = files[i];
                        if (url.indexOf(key) > -1) {
                            callback(_blanket.blanketSession[key]);
                            foundInSession = true;
                            return;
                        }
                    }
                }

                if (!foundInSession) {
                    var xhr = _blanket.utils.createXhr();
                    _proxyXHROpen.call(xhr, 'GET', url, false);

                    // Allow overrides specified in config
                    if (onXhr) {
                        onXhr(xhr, url);
                    }

                    xhr.onreadystatechange = function(evt) {
                        var status, err;

                        // Do not explicitly handle errors, those should be
                        // visible via console output in the browser.
                        if (xhr.readyState === 4) {
                            status = xhr.status;
                            if ((status > 399 && status < 600)
                            // || (status === 0 && navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
                            ) {
                                // An http 4xx or 5xx error. Signal an error.
                                err = new Error(url + ' HTTP status: ' + status);
                                err.xhr = xhr;
                                errback(err);
                            } else {
                                callback(xhr.responseText);
                            }
                        }
                    };

                    try {
                        xhr.send(null);
                    } catch (e) {
                        if (e.code && (e.code === 101 || e.code === 1012) && _blanket.options("ignoreCors") === false) {
                            //running locally and getting error from browser
                            _blanket.showManualLoader();
                        } else {
                            throw e;
                        }
                    }
                }
            },

            lazyLoadCoverage: function() {
                !function(Object, getPropertyDescriptor, getPropertyNames){
                    // (C) WebReflection - Mit Style License
                    if (!(getPropertyDescriptor in Object)) {
                        var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
                        Object[getPropertyDescriptor] = function getPropertyDescriptor(o, name) {
                            var proto = o, descriptor;
                            while (proto && !(descriptor = getOwnPropertyDescriptor(proto, name))) {
                                proto = proto.__proto__;
                            }
                            return descriptor;
                        };
                    }

                    if (!(getPropertyNames in Object)) {
                        var getOwnPropertyNames = Object.getOwnPropertyNames, ObjectProto = Object.prototype, keys = Object.keys;
                        Object[getPropertyNames] = function getPropertyNames(o) {
                            var proto = o, unique = {}, names, i;
                            while (proto != ObjectProto) {
                                for (names = getOwnPropertyNames(proto), i = 0; i < names.length; i++) {
                                    unique[names[i]] = true;
                                }
                                proto = proto.__proto__;
                            }
                            return keys(unique);
                        };
                    }
                }(Object, "getPropertyDescriptor", "getPropertyNames");

                // Detect url paramenter of XMLHttpRequest.prototype.open. If url has been
                // instrumented, use instrumented, otherwise load it as default.
                XMLHttpRequest.prototype.open = function(method, url) {
                    var instrumented,
                        originalResponse = Object.getPropertyDescriptor(this, 'response'),
                        originalResponseText = Object.getPropertyDescriptor(this, 'responseText'),
                        fakeScript = { src: url },
                        xhr;

                    // Check whether script url pass the filter
                    if (method.toUpperCase() === 'GET' &&
                        _blanket.utils.filter([fakeScript]).length > 0 &&
                        url.indexOf('.js') > 0) {
                        url = blanket.utils.qualifyURL(url);

                        // If the script doesn't instrument yet, we download then instrument it
                        if (!_blanket.utils.cache[url]) {
                            xhr = new XMLHttpRequest();
                            _proxyXHROpen.call(xhr, 'GET', url, false);
                            xhr.send(null);

                            if (xhr.status === 200) {
                                instrumented = _blanket.instrument({
                                    inputFile: xhr.responseText,
                                    inputFileName: url
                                });
                            } else {
                                console.log('Blanket cannot use XMLHttpRequest to fetch file : ' + url + ' skip it\'s instrumenting');
                            }

                        // If the script has instrumented, we use cache
                        } else {
                            instrumented = _blanket.utils.cache[url];
                        }

                        // Force user to get instrumented response
                        Object.defineProperties(this, {
                            'response': {
                                get: function() {
                                    return instrumented;
                                }
                            },
                            'responseText': {
                                get: function() {
                                    return instrumented;
                                }
                            }
                        });
                    } else {
                        // Restore original response
                        Object.defineProperties(this, {
                            'response': originalResponse,
                            'responseText': originalResponseText
                        });
                    }

                    return _proxyXHROpen.apply(this, Array.prototype.slice.call(arguments));
                };

                // Detect src paramenter in DOM inject behavior function. If src has been
                // instrumented, use instrumented source, otherwise load it as default.
                var attachScriptToDom = function(proxy, newElement) {
                    var args = Array.prototype.slice.call(arguments, 1),
                        url = blanket.utils.qualifyURL(newElement.src),
                        instrumented,
                        xhr,
                        success = true;

                    // Check whether script url pass the filter
                    if (newElement.nodeName === 'SCRIPT' &&
                        _blanket.utils.filter([newElement]).length > 0 &&
                        url.indexOf('.js') > 0) {

                        // If the script doesn't instrument yet, we download then instrument it
                        if (!_blanket.utils.cache[url]) {
                            xhr = new XMLHttpRequest();
                            _proxyXHROpen.call(xhr, 'GET', url, false);
                            xhr.send(null);

                            if (xhr.status === 200) {
                                instrumented = _blanket.instrument({
                                    inputFile: xhr.responseText,
                                    inputFileName: url
                                });
                            } else {
                                success = false;
                                console.log('Blanket cannot use attachScriptToDom to fetch file : ' + url + ' skip it\'s instrumenting');
                            }

                        // If the script has instrumented, we use cache
                        } else {
                            instrumented = _blanket.utils.cache[url];
                        }

                        // Execute instrumented script
                        if (success) {
                            newElement.src = 'data:' + newElement.type + ';base64,' +
                                btoa(unescape(encodeURIComponent(instrumented)));
                        }
                    }

                    return proxy.apply(this, args);
                };

                Element.prototype.appendChild = function() {
                    var args = Array.prototype.slice.call(arguments);
                    args.unshift(_proxyAppendChild);
                    return attachScriptToDom.apply(this, args);
                };

                Element.prototype.insertBefore = function() {
                    var args = Array.prototype.slice.call(arguments);
                    args.unshift(_proxyInsertBefore);
                    return attachScriptToDom.apply(this, args);
                };

                Element.prototype.replaceChild = function() {
                    var args = Array.prototype.slice.call(arguments);
                    args.unshift(_proxyReplaceChild);
                    return attachScriptToDom.apply(this, args);
                };
            }
        }
    });

    (function() {

        var requirejs = blanket.options("commonJS") ? blanket._commonjs.requirejs : window.requirejs;
        if (!_blanket.options("engineOnly") && _blanket.options("existingRequireJS")) {

            _blanket.utils.oldloader = requirejs.load;

            requirejs.load = function(context, moduleName, url) {
                _blanket.requiringFile(url);
                _blanket.utils.getFile(url,
                    function(content) {
                        _blanket.utils.processFile(
                            content,
                            url,
                            function newLoader() {
                                context.completeLoad(moduleName);
                            },
                            function oldLoader() {
                                _blanket.utils.oldloader(context, moduleName, url);
                            }
                        );
                    }, function(err) {
                        _blanket.requiringFile();
                        throw err;
                    });
            };
        }

        // Save the XHR constructor, just in case frameworks like Sinon would sandbox it.
        _blanket.utils.cacheXhrConstructor();

    })();

})(blanket);
