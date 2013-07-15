/* I don't think this is needed because we don't need to test istanbul */

test( "blanket instrument", function() {
    expect(2);
    var infile = "var a=1;if(a==1){a=2;}if(a==3){a=4;}console.log(a);";
    var infilename= "testfile";
    blanket.instrument({
        inputFile: infile,
        inputFileName: infilename
    },function(instrumented){
         ok( instrumented.length > infile.length, "instrumented." );
         ok(instrumented.indexOf("_$blanket['"+infilename+"']") > -1,"added enough instrumentation.");
     });
});

test( "blanket instrument with custom var", function() {
    expect(2);
    var infile = "var a=1;if(a==1){a=2;}if(a==3){a=4;}console.log(a);";
    var infilename= "testfile";
    blanket.options("customVariable","_$blanket");
    blanket.options("sourceURL",true);
    blanket.options("debug",true);
    blanket.instrument({
        inputFile: infile,
        inputFileName: infilename
    },function(instrumented){
         ok( instrumented.length > infile.length, "instrumented." );
         ok(instrumented.indexOf("_$blanket['"+infilename+"']") > -1,"added enough instrumentation.");
     });
});

test("get blanket copy number",function(){
    expect(1);
    ok(blanket._getCopyNumber() > 0,"valid copy number");
});

test('get/set options', function(){
    ok(blanket.options("filter") === null,"get filter");
    ok(blanket.options("ignoreScriptError") === false,"get ignore");
    ok(blanket.options("existingRequireJS") === false,"get existing");
    ok(blanket.options("reporter") === null,"get reporter");
    ok(blanket.options("loader") === null,"get loader");
    ok(blanket.options("adapter") === null,"get adapter");

    blanket.options({
        filter: "test",
        ignoreScriptError: true,
        existingRequireJS: true,
        reporter: "test1",
        loader: "test2",
        adapter: "test3"
    });

    ok(blanket.options("filter") === "test","get filter");
    ok(blanket.options("ignoreScriptError") === true,"get ignore");
    ok(blanket.options("existingRequireJS") === true,"get existing");
    ok(blanket.options("reporter") === "test1","get reporter");
    ok(blanket.options("loader") === "test2","get loader");
    ok(blanket.options("adapter") === "test3","get adapter");

    blanket.options("filter",null);
    blanket.options("ignoreScriptError",false);
    blanket.options("existingRequireJS",false);
    blanket.options("reporter",null);
    blanket.options("loader",null);
    blanket.options("adapter",null);

    ok(blanket.options("filter") === null,"get filter");
    ok(blanket.options("ignoreScriptError") === false,"get ignore");
    ok(blanket.options("existingRequireJS") === false,"get existing");
    ok(blanket.options("reporter") === null,"get reporter");
    ok(blanket.options("loader") === null,"get loader");
    ok(blanket.options("adapter") === null,"get adapter");
});

test('test events', function(){
    expect(1);
    blanket.report = function(result){
      ok(result.instrumentation==="blanket");
    };
    blanket.options("reporter",blanket.report);
    blanket.setupCoverage();
    blanket.onModuleStart();
    blanket.onTestStart();
    blanket.onTestDone();
    blanket.onTestsDone();
});

