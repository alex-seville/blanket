QUnit.config.urlConfig.push({
    id: "coverage",
    label: "Enable coverage",
    tooltip: "Enable code coverage."
});

if ( QUnit.urlParams.coverage ) {

    QUnit.done = function(failures, total) {
        blanket.testEvents.testsDone();
    };
    QUnit.moduleStart(function( details ) {
        blanket.testEvents.suiteStart();
    });
    QUnit.testStart(function( details ) {
        blanket.testEvents.testStart();
    });
    QUnit.testDone(function( details ) {
        blanket.testEvents.testDone(details);
    });
    
    QUnit.begin(function(){
        blanket.testEvents.testsStart();
    });

    require(collectPageScripts(), function() {
        QUnit.start();
    });
}else{
    QUnit.start();
}