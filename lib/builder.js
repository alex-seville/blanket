var _ = require("underscore"),
    fs = require("fs");

var template = fs.readFileSync(__dirname+"/template",'utf8');
var requirejs = fs.readFileSync(__dirname+"/require.js",'utf8');
var parser = fs.readFileSync(__dirname+"/esprima.js",'utf8');
var transformer = fs.readFileSync(__dirname+"/falafel.js",'utf8');
var blanket = fs.readFileSync(__dirname+"/blanket.js",'utf8');

var compiled = _.template(template);

var result = compiled({
    requirejs: requirejs,
    parser: parser,
    transformer: transformer,
    blanket: blanket
});

fs.writeFileSync(__dirname+"/../example/blanket.js",result,'utf8');