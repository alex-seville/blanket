var blanketCore = require("../../src/blanket"),
    assert = require("assert");

describe("blanket core, methods",function(){
    it( "should init", function() {
        this.blanket = new blanketCore();
        assert.equal(typeof this.blanket , "object");
    });
    it( "should be able to get/set options", function() {
        this.blanket = new blanketCore();
        this.blanket.setOption("debug",true);
        assert.equal(this.blanket.getOption("debug") , true);
        this.blanket.setOption("expected","test");
        assert.equal(this.blanket.getOption("expected") , "test");
        this.blanket.setOption({
            "other": "value"
        });
        assert.equal(this.blanket.getOption("other") , "value");
        assert.equal(this.blanket.getOption("expected") , undefined);
    });
    it( "should instrument", function(done) {
        this.blanket = new blanketCore();
        var input = "var test=true;";
        this.blanket.instrument(input,"file.js",function(result){
            assert.notEqual(input,result);
            assert.equal(result.indexOf("_$jscoverage['file.js']") > 0,true);
            done();
        });
    });
});