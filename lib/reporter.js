<script>
(function(blanket){
	var cssSytle = "#blanket-main {margin:2px;background:#EEE;color:#333;clear:both;font-family:'Helvetica Neue Light', 'HelveticaNeue-Light', 'Helvetica Neue', Calibri, Helvetica, Arial, sans-serif;} #blanket-main a {color:#333;text-decoration:none;}  #blanket-main a:hover {text-decoration:underline;} .blanket {margin:0;padding:5px;clear:both;} .bl-error {color:red;}.bl-success {color:#5E7D00;} .bl-file{width:300px;} .bl-cl{float:left;} .blanket div.rs {margin-left:350px; width:150px;} .bl-nb {padding-right:10px;}",
		successRate = 60,
		head = document.head,
		fileNumber = 0,
		body = document.body,
		headerContent,
		bodyContent = "<div id='blanket-main'><div class='blanket bl-title'><div class='bl-cl bl-file'>Blanket.js results</div><div class='bl-cl rs'>Coverage (%)</div><div class='bl-cl rs'>Covered/Total Smts.</div></div>",
		fileTemplate = "<div class='blanket {{statusclass}}'><div class='bl-cl bl-file'><span class='bl-nb'>{{fileNumber}}.</span><a href='#'>{{file}}</a></div><div class='bl-cl rs'>{{percentage}} %</div><div class='bl-cl rs'>{{numberCovered}}/{{totalSmts}}</div><div style='clear:both;'></div></div>";

	var percentage = function(number, total) {
				return (Math.round(((number/total) * 100)*100)/100);
	};

	var appendHtml = function (el, str) {
			var div = document.createElement('div');
		div.innerHTML = str;
		el.appendChild(div);
	}

	var appendStyle = function (el, str) {
			var style = document.createElement('style');
		style.innerHTML = str;
		el.appendChild(style);
	}

	for(var file in blanket)
	{
		fileNumber += 1;

		var statsForFile = blanket[file],
		 	totalSmts = statsForFile.length,
		 	numberOfFilesCovered = 0;

		for(var i = 0; i <= statsForFile.length; i++)
		{
			if(statsForFile[i]) {
				numberOfFilesCovered += 1;
			}
		}
		var result = percentage(numberOfFilesCovered, totalSmts);

		var output = fileTemplate.replace("{{file}}", file)
								 .replace("{{percentage}}",result)
								 .replace("{{numberCovered}}", numberOfFilesCovered)
								 .replace("{{fileNumber}}", fileNumber)
								 .replace("{{totalSmts}}", totalSmts);
		if(result < successRate)
		{	
			output = output.replace("{{statusclass}}", "bl-error");
		} else {
			output = output.replace("{{statusclass}}", "bl-success");
		}
		bodyContent += output;
	}
	bodyContent += "</div>"; //closing main

	appendStyle(head, cssSytle);
	//appendStyle(body, headerContent);
	appendHtml(body, bodyContent);
	//appendHtml(body, '</div>');

})( _$blanket);
</script>