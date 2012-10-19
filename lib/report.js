exports = module.exports = Report;

/*CTOR*/
function Report(type, content) {

    var properFormat = correctRemap(type);

    return {
        content: content,
        format: properFormat
    };
}

var correctRemap = function (type) {
    if (type === "qunit"){
        return prepareReportForQunit;
    } else if (type === "jasmine"){
        return prepareForJasmine;
    } else if (type === "mocha"){
        return prepareForMocha;
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
    
    var remapped = this.content.replace("src/","src-cov/");
    //read content of the reporter.js and inject it
    fs = require('fs');
    fs.readFile('../lib/reporter.js', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        console.log(data);
        var scriptReport = QunitCode.replace("{{reporter}}", data);
        remapped += scriptReport;
        callback(remapped);
    });
};


var QunitCode = "<script>QUnit.done(function( details ){ {{reporter}} })</script>";
var jasmineCode = "<script>jasmine.Runner.prototype.finishCallback = function() {jasmine.getEnv().reporter.reportRunnerResults(this);{{reporter}}};</script>";

var prepareForJasmine = function(callback) {

    var remapped = this.content.replace("src/","src-cov/");
    //read content of the reporter.js and inject it
    fs = require('fs');
    fs.readFile('../lib/reporter.js', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        console.log(data);
        var scriptReport = jasmineCode.replace("{{reporter}}", data);
        remapped += scriptReport;
        callback(remapped);
    });
};
