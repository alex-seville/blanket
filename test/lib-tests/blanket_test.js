
test( "blanket instrument", function() {
    expect(2);
    var blanket = new Blanket();
    var input = "var test=true;";
    blanket.instrument(input,"file.js",function(result){
        ok(input.length < result.length,"result larger than input");
        ok(result.indexOf("_$jscoverage['file.js']") > 0,"file appears to be instrumented");
    });
});

