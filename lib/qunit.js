if (typeof QUnit !== 'undefined'){
    QUnit.config.urlConfig.push({
        id: "coverage",
        label: "Enable coverage",
        tooltip: "Enable code coverage."
    });

    if ( QUnit.urlParams.coverage  ) {
        var coverageInfo = coverageInfo || {};
        //add the basic info, based on jscoverage
        coverageInfo.instrumentation = "blanket";
        
        coverageInfo.stats = {
            "suites": 0,
            "tests": 0,
            "passes": 0,
            "pending": 0,
            "failures": 0,
            "start": new Date()
        };

        QUnit.done = function(failures, total) {
            coverageInfo.stats.end = new Date();
            
            blanket.report(coverageInfo);
        };
        QUnit.moduleStart(function( details ) {
            coverageInfo.stats.suites++;
        });
        QUnit.testStart(function( details ) {
            coverageInfo.stats.tests++;
            coverageInfo.stats.pending++;
        });
        QUnit.testDone(function( details ) {
            if(details.passed == details.total){
                coverageInfo.stats.passes++;
            }else{
                coverageInfo.stats.failures++;
            }
            coverageInfo.stats.pending--;
        });
        
        QUnit.begin(function(){
            
        });
        if (startTest){
            var globalFilter;
            //http://stackoverflow.com/a/2954896
            var toArray =Array.prototype.slice;
            var scripts = toArray.call(document.scripts);
            toArray.call(scripts[scripts.length - 1].attributes)
                                .forEach(function(es){
                                    if(es.nodeName == "data-cover-only"){
                                        globalFilter = es.nodeValue;
                                        return;
                                    }
                                });

            window.onload = function(){
                require(collectPageScripts(globalFilter), function() {
                    QUnit.start();
                });
            };
        }
    }else{
        QUnit.start();
    }
}