(function() {

    if (! jasmine) {
        throw new Exception("jasmine library does not exist in global namespace!");
    }

    function elapsed(startTime, endTime) {
        return (endTime - startTime)/1000;
    }

    function ISODateString(d) {
        function pad(n) { return n < 10 ? '0'+n : n; }

        return d.getFullYear() + '-' +
            pad(d.getMonth()+1) + '-' +
            pad(d.getDate()) + 'T' +
            pad(d.getHours()) + ':' +
            pad(d.getMinutes()) + ':' +
            pad(d.getSeconds());
    }

    function trim(str) {
        return str.replace(/^\s+/, "" ).replace(/\s+$/, "" );
    }

    function escapeInvalidXmlChars(str) {
        return str.replace(/\&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/\>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/\'/g, "&apos;");
    }

    /**
     * based on https://raw.github.com/larrymyers/jasmine-reporters/master/src/jasmine.junit_reporter.js
     */
    var BlanketReporter = function(savePath, consolidate, useDotNotation) {
        
        blanket.setupCoverage();
    };
    BlanketReporter.finished_at = null; // will be updated after all files have been written

    BlanketReporter.prototype = {
        reportSpecStarting: function(spec) {
            blanket.onTestStart();
        },

        reportSpecResults: function(suite) {
            var results = suite.results();

            blanket.onTestDone(results.totalCount,results.passed());
        },

        reportRunnerResults: function(runner) {
            blanket.onTestsDone();
        },

        log: function(str) {
            var console = jasmine.getGlobal().console;

            if (console && console.log) {
                console.log(str);
            }
        }
    };


    // export public
    jasmine.BlanketReporter = BlanketReporter;

    //override existing jasmine execute
    jasmine.getEnv().execute = function(){ console.log("waiting for blanket..."); };
    
    //check to make sure requirejs is completed before we start the test runner
    var allLoaded = function() {
        return window.jasmine.getEnv().currentRunner().specs().length > 0 && _blanket.outstandingRequireFiles === 0;
    };

    blanket.beforeStartTestRunner({
        checkRequirejs:false,
        callback:function(){
            jasmine.getEnv().addReporter(new jasmine.BlanketReporter());
            var check = function() {
                if (allLoaded()) {
                    window.jasmine.getEnv().currentRunner().execute();
                } else {
                    setTimeout(check, 13);
                }
            };
            check();
     }
    });
})();