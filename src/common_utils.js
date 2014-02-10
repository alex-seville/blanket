/*
  Blanket.js
  Common utils
  Version 2.0

  Blanket utility functions
*/

(function(globalScope){
    var title = "BLANKET",
        showDebug=false;

    /**
    * Util debugging
    *
    * @method debug
    * @param {String} msg The debug message to output
    */
    function debug(msg){
        if (showDebug){
            console.log(title,"-",msg);
        }
    }

    /**
    * Enable util debugging
    *
    * @method enableDebug
    */
    function enableDebug(){
        showDebug=true;
    }

    /**
    * Check a filename against the various matching formats Blanket supports
    * Matching patterns can be strings, arrays, regexs, functions, or combinations of any.
    *
    * @method matchPatternAttribute
    * @param {String} filename The filename is match against
    * @param {String} pattern The pattern to match
    * @param {Boolean} Result of whether the pattern matches the filename
    */
    function matchPatternAttribute(filename,pattern){
        if (typeof pattern === 'string'){
            if (pattern.indexOf("[") === 0){
                //treat as array
                var pattenArr = pattern.slice(1,pattern.length-1).split(",");
                return pattenArr.some(function(elem){
                    return matchPatternAttribute(filename,normalizeBackslashes(elem.slice(1,-1)));
                });
            }else if ( pattern.indexOf("//") === 0){
                var ex = pattern.slice(2,pattern.lastIndexOf('/')),
                    mods = pattern.slice(pattern.lastIndexOf('/')+1),
                    regex = new RegExp(ex,mods);
                return regex.test(filename);
            }else if (pattern.indexOf("#") === 0){
                return globalScope[pattern.slice(1)].call(globalScope,filename);
            }else{
                return filename.indexOf(normalizeBackslashes(pattern)) > -1;
            }
        }else if ( pattern instanceof Array ){
            return pattern.some(function(elem){
                return matchPatternAttribute(filename,elem);
            });
        }else if (pattern instanceof RegExp){
            return pattern.test(filename);
        }else if (typeof pattern === "function"){
            return pattern.call(globalScope,filename);
        }
    }

    /**
    * Normalize backslashes.  For cross platform support.
    *
    * @method normalizeBackslashes
    * @param {String} str The string for-which to normalize backslashes
    */
    function normalizeBackslashes(str) {
        return str.replace(/\\/g, '/');
    }

    var exportables = {
        debug: debug,
        enableDebug: enableDebug,
        matchPatternAttribute: matchPatternAttribute
    };

    
    globalScope.Blanket.utils = exportables;
})(this);
