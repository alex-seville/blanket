QUnit.config.autostart = false;

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

var toArray = Array.prototype.slice;
var scripts = toArray.call(document.scripts);
var scriptNames = scripts.filter(function(elem){
    return toArray.call(elem.attributes).some(function(es){
        return es.nodeName == "data-test";
    });
}).map(function(s){
    return toArray.call(s.attributes).filter(function(sn){
        return sn.nodeName == "src";
    })[0].nodeValue.replace(".js","");
});

QUnit.done = function(failures, total) {
    _$blanket.stats.end = new Date();
   blanket.report(_$blanket);
};
QUnit.moduleStart(function( details ) {
    _$blanket.stats.suites++;
});
QUnit.testStart(function( details ) {
    _$blanket.stats.tests++;
    _$blanket.stats.pending++;
});
QUnit.testDone(function( details ) {
    if(details.passed == details.total){
        _$blanket.stats.passes++;
    }else{
        _$blanket.stats.failures++;
    }
    _$blanket.stats.pending--;
});

require(scriptNames, function() {
    //just double check that we have the global var
    if (!window._$blanket) window._$blanket = {};
    //add the basic info, based on jscoverage
    _$blanket.instrumentation = "blanket";
    _$blanket.sloc = 0;
    _$blanket.hits = 0;
    _$blanket.misses = 0;
    _$blanket.coverage = 0;
    _$blanket.files = [];
    _$blanket.stats = {
        "suites": 0,
        "tests": 0,
        "passes": 0,
        "pending": 0,
        "failures": 0,
        "start": new Date(),
        "end": "",
        "duration": 0
    };

    QUnit.start();
});