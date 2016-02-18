// lcov_reporter
(function() {
    // takes the option: toHTML {boolean}

    var body = document.body;

    var appendResult = function(filename, data, options) {

        var str = "";
        str += 'SF:' + filename + '\n';

        data.source.forEach(function(line, num) {
            // increase the line number, as JS arrays are zero-based
            num++;

            if (data[num] !== undefined) {
                str += 'DA:' + num + ',' + data[num] + '\n';
            }
        });

        str += 'end_of_record\n';

        if (options.toHTML) {
            var div = document.createElement('div');
            div.className = "blanket_lcov_reporter";
            div.innerText = str;
            body.appendChild(div);
        } else {
            window._$blanket_LCOV = (window._$blanket_LCOV || '') + str;
        }
    };

    blanket.customReporter = function(coverageData, options) {
        options = options || {
            toHTML: true
        };

        for (var filename in coverageData.files) {
            var data = coverageData.files[filename];
            appendResult(filename, data, options);
        }
    };

})();
