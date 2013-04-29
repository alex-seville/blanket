(function() {

    function usageCoverage(){
        blanket.setupCoverage();
        showReporter();
        var currCov = copyObject(_$blanket);
        setInterval(function(){
            if (hasChanged(currCov,_$blanket)){
                updateReporter(_$blanket);
                currCov = copyObject( _$blanket);
            }
        },500);
    }

    blanket.beforeStartTestRunner({
        callback:function(){
            usageCoverage();
        }
    });

    var showReporter = function(){
        var coverageDiv = document.createElement("div");
        //styles
        coverageDiv.style.position = "fixed";
        coverageDiv.style.height = "20px;";
        coverageDiv.style.width = "100%";
        coverageDiv.style.opacity = 0.6;
        coverageDiv.style.backgroundColor = "#cccccc";
        coverageDiv.style.bottom = 0;
        coverageDiv.style.left = 0;

        coverageDiv.className = "blanket_reporter";
        coverageDiv.innerHTML = "<b style='float:left;padding-right:10px;'>BlanketJS Results:</b>";
        var coverageInfo = document.createElement("i");
        coverageInfo.id = "blanket_results";
        coverageDiv.appendChild(coverageInfo);
        document.body.appendChild(coverageDiv);

        updateReporter(_$blanket);
    };

    var updateReporter = function(data){
        var res = document.getElementById("blanket_results");
        var keys = Object.keys(data);

        var total =0, totalCovered=0;

        for(var i=0;i<keys.length;i++){
            //loop through files
            var file = data[keys[i]];
            var lineKeys = Object.keys(file);
            for(var j=0;j<lineKeys.length;j++){
                //loop through lines
                if (typeof file[lineKeys[j]] === "number"){
                    if (file[lineKeys[j]] > 0){
                        totalCovered++;
                    }
                    total++;
                }
            }
        }
        res.innerText = Math.round(totalCovered/total*100)+"% Covered";
    };

    var hasChanged = function(obj1,obj2){
        var keys1 = Object.keys(obj1);
        var keys2 = Object.keys(obj2);

        if (keys1.length != keys2.length){
            return true;
        }

        var i=0,done=false;
        while(i<keys1.length && !done){
            if (obj1[keys1[i]].toString() != obj2[keys1[i]].toString()){
                done = true;
            }
            i++;
        }
        return done;
    };

    var copyObject = function(obj){
        var newObj = {};

        var keys = Object.keys(obj);
        for (var i=0;i<keys.length;i++){
            newObj[keys[i]]=obj[keys[i]].slice(0);
        }
        return newObj;
    };
})();