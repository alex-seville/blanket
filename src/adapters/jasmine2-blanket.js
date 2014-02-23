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

   
    var BlanketReporter = function() {
        
        blanket.setupCoverage();
    };
    BlanketReporter.finished_at = null; // will be updated after all files have been written

    BlanketReporter.prototype = {
        specStarted: function () {
            blanket.onTestStart();
        },

        specDone: function (result) {
            var passed = result.status === "passed" ? 1 : 0;
            blanket.onTestDone(1,passed);
        },

        jasmineDone: function () {
            blanket.onTestsDone();
        }
    };


    // export public
    jasmine.BlanketReporter = BlanketReporter;
    
    //override existing jasmine execute
    var originalJasmineExecute = jasmine.getEnv().execute;
    jasmine.getEnv().execute = function(){ console.log("waiting for blanket..."); };
    
    //check to make sure requirejs is completed before we start the test runner
    var allLoaded = function() {
        return window.jasmine.getEnv().topSuite().children.length > 0 && blanket.requireFilesLoaded();
    };

    blanket.beforeStartTestRunner({
        checkRequirejs:true,
        condition: allLoaded,
        callback:function(){
            jasmine.getEnv().addReporter(new jasmine.BlanketReporter());
            jasmine.getEnv().execute = originalJasmineExecute;
            jasmine.getEnv().execute();
        }
    });
})();