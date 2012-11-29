var Reporter = function(blanket){
    var cssSytle = "#blanket-main {margin:2px;background:#EEE;color:#333;clear:both;font-family:'Helvetica Neue Light', 'HelveticaNeue-Light', 'Helvetica Neue', Calibri, Helvetica, Arial, sans-serif;} #blanket-main a {color:#333;text-decoration:none;}  #blanket-main a:hover {text-decoration:underline;} .blanket {margin:0;padding:5px;clear:both;border-bottom: 1px solid #FFFFFF;} .bl-error {color:red;}.bl-success {color:#5E7D00;} .bl-file{width:auto;} .bl-cl{float:left;} .blanket div.rs {margin-left:50px; width:150px; float:right} .bl-nb {padding-right:10px;} #blanket-main a.bl-logo {color: #EB1764;cursor: pointer;font-weight: bold;text-decoration: none} .bl-source{ background-color: #FFFFFF; border: 1px solid #CBCBCB; color: #363636; margin: 25px 20px; width: 80%;} .bl-source span{background-color: #EAEAEA;color: #949494;display: inline-block;padding: 0 10px;text-align: center;width: 20px;} .bl-source .miss{background-color:#e6c3c7}",
        script= "  function toggleSource(id) { var element = document.getElementById(id); if(element.style.display === 'block') { element.style.display = 'none'; } else { element.style.display = 'block'; }}",
        successRate = 60,
        head = document.head,
        fileNumber = 0,
        body = document.body,
        headerContent,
        bodyContent = "<div id='blanket-main'><div class='blanket bl-title'><div class='bl-cl bl-file'><a href='http://migrii.github.com/blanket/' target='_blank' class='bl-logo'>Blanket.js</a> results</div><div class='bl-cl rs'>Coverage (%)</div><div class='bl-cl rs'>Covered/Total Smts.</div><div style='clear:both;'></div></div>",
        fileTemplate = "<div class='blanket {{statusclass}}'><div class='bl-cl bl-file'><span class='bl-nb'>{{fileNumber}}.</span><a href='javascript:toggleSource(\"file-{{fileNumber}}\")'>{{file}}</a></div><div class='bl-cl rs'>{{percentage}} %</div><div class='bl-cl rs'>{{numberCovered}}/{{totalSmts}}</div><div id='file-{{fileNumber}}' class='bl-source' style='display:none;'>{{source}}</div><div style='clear:both;'></div></div>";

    var percentage = function(number, total) {
        return (Math.round(((number/total) * 100)*100)/100);
    };

    var appendTag = function (type, el, str) {
        var dom = document.createElement(type);
        dom.innerHTML = str;
        el.appendChild(dom);
    };

    var files = blanket.files;
    for(var file in files)
    {
        fileNumber += 1;

        var statsForFile = files[file],
            totalSmts = statsForFile.length-1,
            numberOfFilesCovered = 0,
            code = [],
            i = 0;

        for(i = 0; i < statsForFile.source.length; i +=1){
            code[i] = "<div class='{{executed}}'><span class=''>"+i+"</span>"+statsForFile.source[i]+"</div>";
        }

        for(i = 0; i < statsForFile.length; i++)
        {
            if(statsForFile[i]) {
                numberOfFilesCovered += 1;
                code[i] = code[i].replace("{{executed}}",'hit');
            }else{
                if(statsForFile[i] === 0){
                    code[i] = code[i].replace("{{executed}}",'miss');                    
                }
            }
        }        
        var result = percentage(numberOfFilesCovered, totalSmts);

        var output = fileTemplate.replace("{{file}}", file)
                                 .replace("{{percentage}}",result)
                                 .replace("{{numberCovered}}", numberOfFilesCovered)
                                 .replace(/{{fileNumber}}/g, fileNumber)
                                 .replace("{{totalSmts}}", totalSmts)
                                 .replace("{{source}}", code.join(" "));
        if(result < successRate)
        {   
            output = output.replace("{{statusclass}}", "bl-error");
        } else {
            output = output.replace("{{statusclass}}", "bl-success");
        }
        bodyContent += output;
    }
    bodyContent += "</div>"; //closing main

    appendTag('style', head, cssSytle);
    //appendStyle(body, headerContent);
    appendTag('div', body, bodyContent);
    //appendHtml(body, '</div>');
    appendTag('script', head, script);

};