

var commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
    defineRegExp = /(^|[^\.])define\s*\(/,
    requireRegExp = /(^|[^\.])require\s*\(\s*['"][^'"]+['"]\s*\)/,
    exportsRegExp = /exports\s*=\s*/,
    sourceUrlRegExp = /\/\/@\s+sourceURL=/;

var blanketEval = function(data){
    return ( window.execScript || function( data ) {
               //borrowed from jquery
window[ "eval" ].call( window, data );
            } )( data );
};

//we need to keep a copy of the old loader
requirejs.load = function (context, moduleName, url) {
    var hasLocation = typeof location !== 'undefined' && location.href,
    defaultHostName = hasLocation && location.hostname,
    defaultPort = hasLocation && (location.port || undefined),
    defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, '');

    
    requirejs.cget(url, function (content) {
        //Determine if a wrapper is needed. First strip out comments.
        //This is not bulletproof, but it is good enough for elminating
        //false positives from comments.
        var temp = content.replace(commentRegExp, '');

        blanket.instrument({
            inputFile: content,
            inputFileName: url
        },function(instrumented){
            //console.log("instrumented:\n"+instrumented);
            
            try{
                blanketEval(instrumented);
                context.completeLoad(moduleName);
            }
            catch(err){
                console.log("Error parsing instrumented code: "+err);
            }
            
        });
        

        

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
    var scriptNames = scripts.filter(function(elem){
        return toArray.call(elem.attributes).some(function(es){
            return es.nodeName == "data-cover";
        });
    }).map(function(s){
        return toArray.call(s.attributes).filter(function(sn){
            return sn.nodeName == "src";
        })[0].nodeValue.replace(".js","");
    });
    return scriptNames;
}
