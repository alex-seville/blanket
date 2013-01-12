blanket.defaultReporter = function(coverage){
    var cssSytle = "#blanket-main {margin:2px;background:#EEE;color:#333;clear:both;font-family:'Helvetica Neue Light', 'HelveticaNeue-Light', 'Helvetica Neue', Calibri, Helvetica, Arial, sans-serif; font-size:17px;} #blanket-main a {color:#333;text-decoration:none;}  #blanket-main a:hover {text-decoration:underline;} .blanket {margin:0;padding:5px;clear:both;border-bottom: 1px solid #FFFFFF;} .bl-error {color:red;}.bl-success {color:#5E7D00;} .bl-file{width:auto;} .bl-cl{float:left;} .blanket div.rs {margin-left:50px; width:150px; float:right} .bl-nb {padding-right:10px;} #blanket-main a.bl-logo {color: #EB1764;cursor: pointer;font-weight: bold;text-decoration: none} .bl-source{ overflow-x:scroll; background-color: #FFFFFF; border: 1px solid #CBCBCB; color: #363636; margin: 25px 20px; width: 80%;} .bl-source div{white-space:nowrap;} .bl-source span{background-color: #EAEAEA;color: #949494;display: inline-block;padding: 0 10px;text-align: center; } .bl-source .miss{background-color:#e6c3c7} .bl-source span.branchWarning{color:#000;background-color:yellow;} .bl-source span.branchOkay{color:#000;background-color:transparent;}",
        successRate = 60,
        head = document.head,
        fileNumber = 0,
        body = document.body,
        headerContent,
        bodyContent = "<div id='blanket-main'><div class='blanket bl-title'><div class='bl-cl bl-file'><a href='http://migrii.github.com/blanket/' target='_blank' class='bl-logo'>Blanket.js</a> results</div><div class='bl-cl rs'>Coverage (%)</div><div class='bl-cl rs'>Covered/Total Smts.</div><div style='clear:both;'></div></div>",
        fileTemplate = "<div class='blanket {{statusclass}}'><div class='bl-cl bl-file'><span class='bl-nb'>{{fileNumber}}.</span><a href='javascript:blanket_toggleSource(\"file-{{fileNumber}}\")'>{{file}}</a></div><div class='bl-cl rs'>{{percentage}} %</div><div class='bl-cl rs'>{{numberCovered}}/{{totalSmts}}</div><div id='file-{{fileNumber}}' class='bl-source' style='display:none;'>{{source}}</div><div style='clear:both;'></div></div>";

    function blanket_toggleSource(id) {
        var element = document.getElementById(id);
        if(element.style.display === 'block') {
            element.style.display = 'none';
        } else {
            element.style.display = 'block';
        }
    }


    var script = document.createElement("script");
    script.type = "text/javascript";
    script.text = blanket_toggleSource.toString().replace('function ' + blanket_toggleSource.name, 'function blanket_toggleSource');
    body.appendChild(script);

    var percentage = function(number, total) {
        return (Math.round(((number/total) * 100)*100)/100);
    };

    var appendTag = function (type, el, str) {
        var dom = document.createElement(type);
        dom.innerHTML = str;
        el.appendChild(dom);
    };

    function escapeInvalidXmlChars(str) {
        return str.replace(/\&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/\>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/\'/g, "&apos;");
    }

    function isBranchFollowed(data,bool){
        if (typeof data === 'undefined' || typeof data === null){
            return false;
        }
        return data.indexOf(bool) > -1;
    }

    
    function showBranchInfo(lineStr,branchData){
        var branchLine=lineStr;
        if (typeof branchData !== 'undefined'){
            var columns = branchData.map(function(item,index){
                return typeof item !== 'undefined' && item !== null ? index : -1;
            }).filter(function(item){
                return item > -1;
            });

            if (columns.length > 0){
               //branchLine = report_branches(0,columns,branchData,lineStr,0);

            }
        }
        return branchLine;
    }

    function branchReport(colsIndex,src,cols,offset){
      var thisline = cols[colsIndex];
      //consequent
      var newsrc="";
      var cons = thisline.consequent;
      var style = "<span class='" + (isBranchFollowed(thisline,true) ? 'branchOkay' : 'branchWarning') + "'>";
      newsrc += escapeInvalidXmlChars(src.slice(0,cons.start.column-offset)) + style;
      
      if (cols.length > colsIndex+1 && cols[colsIndex+1].consequent.start.column-offset < cols[colsIndex].consequent.end.column-offset){
        var res = branchReport(colsIndex+1,src.slice(cons.start.column-offset,cons.end.column-offset),cols,cons.start.column-offset);
        newsrc += res.src;
        cols = res.cols;
        cols[colsIndex+1] = cols[colsIndex+2];
        cols.length--;
      }else{
        newsrc += escapeInvalidXmlChars(src.slice(cons.start.column-offset,cons.end.column-offset));
      }
      newsrc += "</span>";

      var alt = thisline.alternate;
      newsrc += escapeInvalidXmlChars(src.slice(cons.end.column-offset,alt.start.column-offset));
      style = "<span class='" + (isBranchFollowed(thisline,false) ? 'branchOkay' : 'branchWarning') + "'>";
      newsrc +=  style;
      if (cols.length > colsIndex+1 && cols[colsIndex+1].consequent.start.column-offset < cols[colsIndex].alternate.end.column-offset){
        var res2 = branchReport(colsIndex+1,src.slice(alt.start.column-offset,alt.end.column-offset),cols,alt.start.column-offset);
        newsrc += res2.src;
        cols = res2.cols;
        cols[colsIndex+1] = cols[colsIndex+2];
        cols.length--;
      }else{
        newsrc += escapeInvalidXmlChars(src.slice(alt.start.column-offset,alt.end.column-offset));
      }
      newsrc += "</span>";
      newsrc += escapeInvalidXmlChars(src.slice(alt.end.column-offset));
      src = newsrc;
      return {src:src, cols:cols};
    }

    var isUndefined =  function(item){
            return typeof item !== 'undefined';
      };

    var files = coverage.files;
    for(var file in files)
    {
        fileNumber++;

        var statsForFile = files[file],
            totalSmts = 0,
            numberOfFilesCovered = 0,
            code = [],
            i;
        

        var end = [];
        for(i = 0; i < statsForFile.source.length; i +=1){
            var src = statsForFile.source[i];
            
            if (typeof statsForFile.branchData !== 'undefined'){
                if (typeof statsForFile.branchData[i+1] !== 'undefined'){
                  var cols = statsForFile.branchData[i+1].filter(isUndefined);
                  var colsIndex=0;
                  
                    
                src = branchReport(colsIndex,src,cols,0).src;
                  
                }else{
                  src = escapeInvalidXmlChars(src);
                }
              }else{
                src = escapeInvalidXmlChars(src);
              }
              var lineClass="";
              if(statsForFile[i]) {
                numberOfFilesCovered += 1;
                totalSmts += 1;
                lineClass = 'hit';
              }else{
                if(statsForFile[i] === 0){
                    totalSmts++;
                    lineClass = 'miss';
                }
              }
              code[i + 1] = "<div class='"+lineClass+"'><span class=''>"+(i + 1)+"</span>"+src+"</div>";
        }

        
        var result = percentage(numberOfFilesCovered, totalSmts);

        var output = fileTemplate.replace("{{file}}", file)
                                 .replace("{{percentage}}",result)
                                 .replace("{{numberCovered}}", numberOfFilesCovered)
                                 .replace(/\{\{fileNumber\}\}/g, fileNumber)
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
    if (document.getElementById("blanket-main")){
        document.getElementById("blanket-main").innerHTML=
            bodyContent.slice(23,-6);
    }else{
        appendTag('div', body, bodyContent);
    }
    //appendHtml(body, '</div>');
};
