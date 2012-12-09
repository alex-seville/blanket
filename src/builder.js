var _ = require("underscore"),
    fs = require("fs"),
    uglifyjs = require('uglify-js');
var testrunner = "qunit";

if (process.argv.length > 2){
  testrunner = process.argv[2];
}

var path = process.cwd() + '/package.json';


var version = JSON.parse(fs.readFileSync(path, 'utf8')).version;

var template = fs.readFileSync(__dirname+"/../build/qunit",'utf8');
var requirejs = fs.readFileSync(__dirname+"/lib/require.js",'utf8');
var parser = fs.readFileSync(__dirname+"/lib/esprima.js",'utf8');
var transformer = fs.readFileSync(__dirname+"/lib/falafel.js",'utf8');
var blanket = fs.readFileSync(__dirname+"/blanket.js",'utf8');
var reporter = fs.readFileSync(__dirname+"/qunit/reporter.js",'utf8');
var blanketRequire = fs.readFileSync(__dirname+"/blanketRequire.js",'utf8');
var noAutoRun = fs.readFileSync(__dirname+"/qunit/noautorun.js",'utf8');
var testhooks = fs.readFileSync(__dirname+"/qunit/qunit.js",'utf8');
var node = fs.readFileSync(__dirname+"/node.js",'utf8');
var config = fs.readFileSync(__dirname+"/config.js",'utf8');

var compiled = _.template(template);



    var result = compiled({
        requirejs: requirejs,
        parser: parser,
        transformer: transformer,
        blanket: blanket,
        reporter: reporter,
        blanketRequire: blanketRequire,
        noAutoRun: noAutoRun,
        testhooks: testhooks,
        version:version,
        config:config
    });


    var jsp = uglifyjs.parser;
    var pro = uglifyjs.uglify;

    ast = jsp.parse(result);
    ast = pro.ast_mangle(ast,  {});
    ast = pro.ast_squeeze(ast,  {});
    var minResult = pro.gen_code(ast,  {});


    //need to check for existence of dist folders and create them
    fs.writeFileSync(__dirname+"/../dist/"+testrunner+"/blanket.js",result,'utf8');
    fs.writeFileSync(__dirname+"/../dist/"+testrunner+"/blanket.min.js",minResult,'utf8');

console.log("Built.");