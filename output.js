(function(){
	console.log("output the result");
	var blanket = _$blanket;
	console.log(blanket);
	// Check for the various File API support.

	  for(var file in blanket)
		{
			var statsForFile = blanket[file];
			for(var i = 0; i <= statsForFile.length; i++)
			{
				if(statsForFile[i]) {
					console.log("Line "+ i + "has been parsed");	
				} else {
					console.log("Line "+ i + "has not been parsed");
				}
			}
		}

})();

global._$jscoverage = {
	"file1" : {
		"1" : 1,
		"2" : 0,
		"3" : 0,
		"4" : 0,
		"5" : 0,
		"6" : 0,
		"7" : 0,
		"8" : 1,
		source : [1,2,3,4,5,6,7,8]
	}
}