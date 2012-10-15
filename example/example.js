var jsCover = require("../lib/jsCover");

var testFile = "var t='test';\nif (t !== 'test'){\n t='bob';\n}\nconsole.log(t);";

var testInstrumented = jsCover.instrument({
   inputFile: testFile,
   inputFileName: "test.js" 
},function(result){
    var evalCode = result;
    evalCode += "\n";
    evalCode += "var totalLines = _$jscover['test.js'].length;\n";
    evalCode += "var emptyLines = _$jscover['test.js'].filter(function(element,index,array){ return element == 0; }).length;\n";
    evalCode += "var coverage = (totalLines-emptyLines)/totalLines;\n";
    evalCode += "console.log('Coverage: '+(coverage*100)+'%');";
    eval(evalCode);
    console.log("Instrumented:\n");
    console.log(result);
});