var _ = require("underscore"),
    fs = require("fs"),
    uglifyjs = require('uglify-js');

var template = fs.readFileSync(__dirname+"/template",'utf8');
var requirejs = fs.readFileSync(__dirname+"/require.js",'utf8');
var parser = fs.readFileSync(__dirname+"/esprima.js",'utf8');
var transformer = fs.readFileSync(__dirname+"/falafel.js",'utf8');
var blanket = fs.readFileSync(__dirname+"/blanket.js",'utf8');
var reporter = fs.readFileSync(__dirname+"/reporter.js",'utf8');

var compiled = _.template(template);

var result = compiled({
    requirejs: requirejs,
    parser: parser,
    transformer: transformer,
    blanket: blanket,
    reporter: reporter
});

var min = false;

if (min){

    var jsp = uglifyjs.parser;
    var pro = uglifyjs.uglify;

    ast = jsp.parse(result);
    ast = pro.ast_mangle(ast,  {});
    ast = pro.ast_squeeze(ast,  {});
    result = pro.gen_code(ast,  {});
}

fs.writeFileSync(__dirname+"/../dist/blanket.js",result,'utf8');