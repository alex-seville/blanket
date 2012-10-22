exports = module.exports = Report;

/**
 *  Const
 */
var QUNITCODE = "<script>QUnit.done(function( details ){ {{reporter}} })</script>";
var JASMINECODE = "<script>jasmine.Runner.prototype.finishCallback = function() {jasmine.getEnv().reporter.reportRunnerResults(this);{{reporter}}};</script>";

/**
 *  CTOR
 *  @type: "qunit, mocha, jasmine"
 *  @content: "content of the runner"
 */
function Report(type, content) {

    var properFormat = correctRemap(type);

    return {
        runner: type,
        content: content,
        format: properFormat
    };
}

/**
 * Strategy to decide which format function to use
 */
var correctRemap = function (type) {
    var currentType = type;

    switch(currentType)
    {
        case "qunit":
            return prepareReportForQunit;
        case "jasmine":
            return prepareForJasmine;
        case "mocha":
            return prepareForMocha;
        default:
            throw "Invalid Runner";
    }
}

var prepareForMocha = function(callback) {
    //this is dirty, should use regex or something.
    var remapped = this.content.replace("require(\"../src/","require(\"../src-cov/");
    //dirty output
    remapped += "\nconsole.log(_$blanket);";
    callback(remapped);
};

var prepareReportForQunit = function(callback) {
    
    var remapped = this.content.replace("src/","src-cov/"); //todo improve by regex
    //read content of the reporter.js and inject it
    fs = require('fs');
    fs.readFile('../lib/reporter.js', 'utf8', function (err,data) {
        if (err)
         return console.log(err);
        
        remapped += QUNITCODE.replace("{{reporter}}", data);
        callback(remapped);
    });
};

var prepareForJasmine = function(callback) {

    var remapped = this.content.replace("src/","src-cov/");
    //read content of the reporter.js and inject it
    fs = require('fs');
    fs.readFile('../lib/reporter.js', 'utf8', function (err,data) {
        if(err)
            return console.log(err);

        remapped += JASMINECODE.replace("{{reporter}}", data);
        callback(remapped);
    });
};
