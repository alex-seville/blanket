(function(_blanket){
_blanket.extend({
    setAdapter: function(adapterPath){
        _blanket._adapter = adapterPath;
        
        if (typeof adapterPath !== "undefined"){
            var request = new XMLHttpRequest();
            request.open('GET', adapterPath, false);
            request.send();
            //load the adapter
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.text = request.responseText;
            (document.body || document.getElementsByTagName('head')[0]).appendChild(script);
        }
    },
    hasAdapter: function(callback){
        return typeof _blanket._adapter !== "undefined";
    },
    report: function(coverage_data){
        coverage_data.files = window._$blanket;
        if (_blanket.getReporter()){
            require([_blanket.getReporter().replace(".js","")],function(r){
                r(coverage_data);
            });
        }else if (typeof _blanket.defaultReporter === 'function'){
            _blanket.defaultReporter(coverage_data);
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
        
        function copy(o){
          var _copy = Object.create( Object.getPrototypeOf(o) );
          var propNames = Object.getOwnPropertyNames(o);
         
          propNames.forEach(function(name){
            var desc = Object.getOwnPropertyDescriptor(o, name);
            Object.defineProperty(_copy, name, desc);
          });
         
          return _copy;
        }

        var scripts = _blanket.utils.collectPageScripts();
        
        _blanket.setFilter(scripts);
        
        var requireConfig = {
            paths: {},
            shim: {}
        };
        var lastDep = {
            deps: []
        };
        var isOrdered = _blanket.getOrdered();
        scripts.forEach(function(file,indx){
            //for whatever reason requirejs
            //prefers when we don't use the full path
            //so we just use a custom name
            var requireKey = "blanket_"+indx;
            requireConfig.paths[requireKey] = file;
            if (isOrdered){
                if (indx > 0){
                   requireConfig.shim[requireKey] = copy(lastDep);
                }
                lastDep.deps = [requireKey];
            }
        });
        require.config(requireConfig);
        require(_blanket.getFilter().map(function(val,indx){
            return "blanket_"+indx;
        }), function(){
            callback();
        });
    },
    beforeStartTestRunner: function(opts){
        opts = opts || {};
        opts.checkRequirejs = typeof opts.checkRequirejs === "undefined" ? true : opts.checkRequirejs;
        opts.callback = opts.callback || function() {  };
        opts.coverage = typeof opts.coverage === "undefined" ? true : opts.coverage;
        if(!(opts.checkRequirejs && _blanket.getExistingRequirejs())){
            if (opts.coverage){
                _blanket._bindStartTestRunner(opts.bindEvent,
                function(){
                    _blanket._loadSourceFiles(opts.callback);
                });
            }else{
                opts.callback();
            }
        }
    },
    utils: {
        qualifyURL: function (url) {
            //http://stackoverflow.com/questions/470832/getting-an-absolute-url-from-a-relative-one-ie6-issue
            var a = document.createElement('a');
            a.href = url;
            return a.href;
        }
    }
});
})(blanket);