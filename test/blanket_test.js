test( "blanket instrument", function() {
    expect(1);
    var infile = "var a=1;if(a==1){a=2;}if(a==3){a=4;}console.log(a);";
    var infilename= "testfile";
    blanket.instrument({
        inputFile: infile,
        inputFileName: infilename
    },function(instrumented){
         ok( instrumented.length > infile.length, "instrumented." );
         ok(typeof _$blanket[infilename] !== undefined && _$blanket[infilename] !== [undefined], "coverage data exists");
         ok(_$blanket[infilename].length == 4,"added enough instrumentation.");
     });
 
});