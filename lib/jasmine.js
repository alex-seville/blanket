
var oldCallback = jasmineEnv.currentRunner().finishCallback;
jasmineEnv.currentRunner().finishCallback = function () {
    oldCallback.apply(this, arguments);
    blanket.testEvents.testsDone();
};
//Not sure how to replace these for jasmine.  Might not need to.
/*
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
*/

require(collectPageScripts, function() {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.execute();
});
