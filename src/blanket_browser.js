blanket.extend({
    setAdapter: function(adapterPath){
        adapter = adapterPath;
        
        if (typeof adapter !== "undefined"){
            var request = new XMLHttpRequest();
            request.open('GET', adapter, false);
            request.send();
            //load the adapter
            //better option than eval?
            //maybe adding a script tag
            eval(request.responseText);
        }
    },
    hasAdapter: function(callback){
        return typeof adapter !== "undefined";
    },
    report: function(coverage_data){
        coverage_data.files = (typeof window === 'undefined' ?  _$jscoverage : window._$blanket );
        if (reporter){
            require([reporter.replace(".js","")],function(r){
                r(coverage_data);
            });
        }else if (typeof blanket.defaultReporter === 'function'){
            blanket.defaultReporter(coverage_data);
        }else{
            throw new Error("no reporter defined.");
        }
    },
    _bindStartTestRunner: function(bindEvent,startEvent){
        if (bindEvent){
            bindEvent(startEvent);
        }else{
            window.addEventListener("load",startEvent,false);
        }
    },
    _loadSourceFiles: function(callback){
        var scripts = collectPageScripts();
        blanket.setFilter(scripts);
        var requireConfig = {
            paths: {},
            shim: {}
        };
        var lastDep = {
            deps: []
        };
        scripts.forEach(function(file,indx){
            requireConfig.paths[file] = file;
            if (indx > 0){
               requireConfig.shim[file] = copy(lastDep);
            }
            lastDep.deps = [file];
        });
        require.config(requireConfig);
        require(blanket.getFilter(), function(){
            callback();
        });
    },
    testEvents: {
        beforeStartTestRunner: function(opts){
            opts = opts || {};
            opts.checkRequirejs = typeof opts.checkRequirejs === "undefined" ? true : opts.checkRequirejs;
            opts.callback = opts.callback || function() {  };
            opts.coverage = typeof opts.coverage === "undefined" ? true : opts.coverage;
            if(!(opts.checkRequirejs && blanket.getExistingRequirejs())){
                if (opts.coverage){
                    blanket._bindStartTestRunner(opts.bindEvent,
                    function(){
                        blanket._loadSourceFiles(opts.callback);
                    });
                }else{
                    opts.callback();
                }
            }
        }
    }
});
