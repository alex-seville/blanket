function normalizeBackslashes(str) {
    return str.replace(/\\/g, '/');
}

function matchPatternAttribute(filename,pattern){
    if (typeof pattern === 'string'){
        if (pattern.indexOf("[") === 1){
            //treat as array
            var pattenArr = pattern.slice(1,pattern.length-1).split(",");
            return pattenArr.some(function(elem){
                return filename.indexOf(normalizeBackslashes(elem)) > -1;
            });
        }else if ( pattern.indexOf("//") === 1){
            //treat as regex
            var patternRegex = pattern.match(new RegExp('^/(.*?)/(g?i?m?y?)$'));
            // sanity check here
            var regex = new RegExp(patternRegex[0], patternRegex[1]);
            return regex.test(filename);
        }else{
            return filename.indexOf(normalizeBackslashes(pattern)) > -1;
        }
    }else if ( pattern instanceof Array ){
        return pattern.some(function(elem){
            return filename.indexOf(normalizeBackslashes(elem)) > -1;
        });
    }else if (pattern instanceof RegExp){
        return pattern.test(filename);
    }
}

var blanketEval = function(data){
    return ( window.execScript || function( data ) {
               //borrowed from jquery
window[ "eval" ].call( window, data );
            } )( data );
};

var oldloader = requirejs.load;
requirejs.load = function (context, moduleName, url) {
    var hasLocation = typeof location !== 'undefined' && location.href,
    defaultHostName = hasLocation && location.hostname,
    defaultPort = hasLocation && (location.port || undefined),
    defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, '');

    
    requirejs.cget(url, function (content) {
        var match = blanket.getFilter();
        if (matchPatternAttribute(url.replace(".js",""),match)){
            blanket.instrument({
                inputFile: content,
                inputFileName: url
            },function(instrumented){
                try{
                    blanketEval(instrumented);
                    context.completeLoad(moduleName);
                }
                catch(err){
                    console.log("Error parsing instrumented code: "+err);
                }
            });
        }else{
            oldloader(context, moduleName, url);
        }

    }, function (err) {
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
            if (status > 399 && status < 600) {
                //An http 4xx or 5xx error. Signal an error.
                err = new Error(url + ' HTTP status: ' + status);
                err.xhr = xhr;
                errback(err);
            } else {
                callback(xhr.responseText);
            }
        }
    };
    xhr.send(null);
};

function collectPageScripts(){
    var toArray = Array.prototype.slice;
    var scripts = toArray.call(document.scripts);
    var selectedScripts=[],scriptNames=[];
    var filter = blanket.getFilter();
    if(filter){
        //global filter in place, data-cover-only
        selectedScripts = toArray.call(document.scripts)
                        .filter(function(s){
                            return toArray.call(s.attributes).filter(function(sn){
                                return sn.nodeName === "src" && matchPatternAttribute(sn.nodeValue,filter);
                            }).length === 1;
                        });
    }else{
        selectedScripts = toArray.call(document.querySelectorAll("script[data-cover]"));
    }
    scriptNames = selectedScripts.map(function(s){
                            return toArray.call(s.attributes).filter(function(sn){
                                return sn.nodeName === "src";
                            })[0].nodeValue.replace(".js","");
                      });
    return scriptNames;
}

