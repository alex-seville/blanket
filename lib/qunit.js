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
            window.onload = function(){
                require(collectPageScripts(), function() {
                    QUnit.start();
                });
            };
        }
    }else{
        QUnit.start();
    }
}