
test( "DOM utils - qualify url", function() {
    var qualified = Blanket.DOMUtils.qualifyURL("./fixture.js");
    ok(qualified.indexOf("test/lib-tests/fixture.js")>0,"qualified");
});

test( "DOM utils - loadFile", function() {
    var file = Blanket.DOMUtils.loadFile("./fixture.js");
    ok(window.DOM_utils_test_js_file_loaded,"file loaded");
    Blanket.DOMUtils.blanketEval("window.DOM_utils_test_js_blanket_eval=true;");
    ok(window.DOM_utils_test_js_blanket_eval,"code evaled");
});

