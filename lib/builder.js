var _ = require("underscore"),
    fs = require("fs"),
    uglifyjs = require('uglify-js');
var testrunner = "qunit";

if (process.argv.length > 2){
  testrunner = process.argv[2];
}

var template = fs.readFileSync(__dirname+"/template",'utf8');
var requirejs = fs.readFileSync(__dirname+"/require.js",'utf8');
var parser = fs.readFileSync(__dirname+"/esprima.js",'utf8');
var transformer = fs.readFileSync(__dirname+"/falafel.js",'utf8');
var blanket = fs.readFileSync(__dirname+"/blanket.js",'utf8');
var reporter = fs.readFileSync(__dirname+"/reporter.js",'utf8');
var blanketRequire = fs.readFileSync(__dirname+"/blanketRequire.js",'utf8');
var noAutoRun = testrunner == "qunit" ? "QUnit.config.autostart = false;" : "";
var testhooks = fs.readFileSync(__dirname+"/qunit.js",'utf8');
var node = fs.readFileSync(__dirname+"/node.js",'utf8');

var compiled = _.template(template);

if (testrunner === "mocha"){
    noAutoRun = "";
    requirejs = "";
    blanketRequire = node;
    testhooks = "";
}

var result = compiled({
    requirejs: requirejs,
    parser: parser,
    transformer: transformer,
    blanket: blanket,
    reporter: reporter,
    blanketRequire: blanketRequire,
    noAutoRun: noAutoRun,
    testhooks: testhooks
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

fs.writeFileSync(__dirname+"/../dist/blanket_"+testrunner+".js",result,'utf8');