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