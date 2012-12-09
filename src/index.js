/*---------------------------------*/
/*                                 */
 /*---------------------------------*/
  /* Blanket.js                      */
   /* version 0.9.4 alpha             */
  /* See README.md for revision news */
 /*---------------------------------*/
  /*                                */
  /*-------------------------------*/


var fs = require("fs");
var path = process.cwd() + '/package.json';

var file = JSON.parse(fs.readFileSync(path, 'utf8'));

var packageConfig = file.scripts &&
                    file.scripts.blanket &&
                    file.scripts.blanket.pattern ?
                      file.scripts.blanket.pattern :
                      "src";
pattern = packageConfig;

var blanket = require("./blanket").blanket;
blanket.setFilter(pattern);
require("./node");


module.exports = blanket;



