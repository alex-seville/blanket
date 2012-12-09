/*---------------------------------*/
/*                                 */
 /*---------------------------------*/
  /* Blanket.js                      */
   /* version 0.9.4 alpha             */
  /* See README.md for revision news */
 /*---------------------------------*/
  /*                                */
  /*-------------------------------*/

module.exports = function(pattern){
    if (!pattern){
        var fs = require("fs");
        var path = process.cwd() + '/package.json';
        var file = JSON.parse(fs.readFileSync(path, 'utf8'));
        var packageConfig = file.scripts &&
                            file.scripts.blanket &&
                            file.scripts.blanket.pattern ?
                              file.scripts.blanket.pattern :
                              "src";
        pattern = packageConfig;
    }
    require("./blanket");
    require("./node")(pattern);
};


