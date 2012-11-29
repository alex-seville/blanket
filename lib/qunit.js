if (typeof QUnit !== 'undefined'){
    QUnit.config.urlConfig.push({
        id: "coverage",
        label: "Enable coverage",
        tooltip: "Enable code coverage."
    });

    if ( QUnit.urlParams.coverage  ) {
        QUnit.begin(function(){
            blanket.setupCoverage();
        });
        
        QUnit.done(function(failures, total) {
            blanket.testEvents.onTestsDone();
        });
        QUnit.moduleStart(function( details ) {
            blanket.testEvents.onModuleStart();
        });
        QUnit.testStart(function( details ) {
            blanket.testEvents.onTestStart();
        });
        QUnit.testDone(function( details ) {
            blanket.testEvents.onTestDone(details.total,details.passed);
        });
        blanket.testEvents.beforeStartTestRunner({
            callback: QUnit.start
        });
    }else{
        blanket.testEvents.beforeStartTestRunner({
            callback: QUnit.start,
            coverage:false
        });
    }
}