QUnit.config.autostart = false;
test( "stop start test", function() {
    ok(true, "here");
    QUnit.start();
    ok(true,"something else");
    QUnit.stop();
    ok(true,"another thing.");
    QUnit.start();
});