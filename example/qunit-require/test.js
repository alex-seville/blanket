define(["sample"],function(){

test( "require test", function() {
  ok( (sampleTest || function(){ return 0;})() == 10, "Passed!" );
});

});