(function() {
    var newOptions = {},
        // http://stackoverflow.com/a/2954896
        toArray = Array.prototype.slice,
        scripts = toArray.call(document.scripts);

    toArray.call(scripts[scripts.length - 1].attributes)
        .forEach(function(es) {
            if (es.nodeName === "data-cover-only") {
                newOptions.filter = es.value;
            }

            if (es.nodeName === "data-cover-never") {
                newOptions.antifilter = es.value;
            }

            if (es.nodeName === "data-cover-reporter") {
                newOptions.reporter = es.value;
            }

            if (es.nodeName === "data-cover-adapter") {
                newOptions.adapter = es.value;
            }

            if (es.nodeName === "data-cover-loader") {
                newOptions.loader = es.value;
            }

            if (es.nodeName === "data-cover-timeout") {
                newOptions.timeout = es.value;
            }

            if (es.nodeName === "data-cover-modulepattern") {
                newOptions.modulePattern = es.value;
            }

            if (es.nodeName === "data-cover-reporter-options") {
                try {
                    newOptions.reporter_options = JSON.parse(es.value);
                } catch (e) {
                    if (blanket.options("debug")) {
                        throw new Error("Invalid reporter options.  Must be a valid stringified JSON object.");
                    }
                }
            }

            if (es.nodeName === "data-cover-testReadyCallback") {
                newOptions.testReadyCallback = es.value;
            }

            if (es.nodeName === "data-cover-customVariable") {
                newOptions.customVariable = es.value;
            }

            if (es.nodeName === "data-cover-flags") {
                var flags = " " + es.value + " ";

                if (flags.indexOf(" ignoreError ") > -1) {
                    newOptions.ignoreScriptError = true;
                }

                if (flags.indexOf(" autoStart ") > -1) {
                    newOptions.autoStart = true;
                }

                if (flags.indexOf(" ignoreCors ") > -1) {
                    newOptions.ignoreCors = true;
                }

                if (flags.indexOf(" branchTracking ") > -1) {
                    newOptions.branchTracking = true;
                }

                if (flags.indexOf(" sourceURL ") > -1) {
                    newOptions.sourceURL = true;
                }

                if (flags.indexOf(" debug ") > -1) {
                    newOptions.debug = true;
                }

                if (flags.indexOf(" engineOnly ") > -1) {
                    newOptions.engineOnly = true;
                }

                if (flags.indexOf(" commonJS ") > -1) {
                    newOptions.commonJS = true;
                }

                if (flags.indexOf(" instrumentCache ") > -1) {
                    newOptions.instrumentCache = true;
                }

                if (flags.indexOf(" lazyload ") > -1) {
                    newOptions.lazyload = true;
                }
            }
        });

    blanket.options(newOptions);

    if (typeof requirejs !== 'undefined') {
        blanket.options("existingRequireJS", true);
    }

    /* setup requirejs loader, if needed */
    if (blanket.options("commonJS")) {
        blanket._commonjs = {};
    }

    window._proxyXHROpen = XMLHttpRequest.prototype.open;
    window._proxyAppendChild = Element.prototype.appendChild;
    window._proxyInsertBefore = Element.prototype.insertBefore;
    window._proxyReplaceChild = Element.prototype.replaceChild;

})();
