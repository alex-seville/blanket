(typeof exports !== "undefined" ? exports : window).travisCov = (function(){
    var main = {
      check: function(cov,userOptions){
        if (!cov){
          console.log("return false");
          return false;
        }
        
        var options = {
          threshold: 50 //defaults to 50%
        };

        if (userOptions){
          options.threshold = userOptions.threshold || options.threshold;
        }
        
        var totals =[];
        for (var filename in cov) {
          var data = cov[filename];
          totals.push(this.reportFile( data,options));
        }
        
        var totalHits = 0;
        var totalSloc = 0;
        totals.forEach(function(elem){
          totalHits += elem[0];
          totalSloc += elem[1];
        });
        
        var globCoverage = (totalHits === 0 || totalSloc === 0) ?
                              0 : totalHits / totalSloc * 100;
        console.log("Coverage: "+Math.floor(globCoverage)+"%");
        if (globCoverage < options.threshold || isNaN(globCoverage)){
          console.log("Code coverage below threshold: "+Math.floor(globCoverage)+ " < "+options.threshold);
          if (typeof process !== "undefined"){
            process.exit(1);
          }
          return false;
          
        }else{
          console.log("Coverage succeeded.");
        }
        return true;
      },
      reportFile: function( data,options) {
        var ret = {
          coverage: 0,
          hits: 0,
          misses: 0,
          sloc: 0
        };
        console.log("reporting ", data);
        if (data.l){
          var keys=Object.keys(data.l);
        
          keys.forEach(function(k){
            var num = k++;
            var line = data.l[k];
            
            if (line === 0) {
              ret.misses++;
              ret.sloc++;
            } else if (line > 0 || line === undefined) {
              ret.hits++;
              ret.sloc++;
            }
          });
        }
        ret.coverage = ret.hits / ret.sloc * 100;
        
        
        return [ret.hits,ret.sloc];
        
      }
  };
  return main;
})();