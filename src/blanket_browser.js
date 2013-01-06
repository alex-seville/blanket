(function(_blanket){
    var oldOptions = _blanket.options;
_blanket.extend({
    outstandingRequireFiles:[],
    options: function(key,value){
        var newVal={};

        if (typeof key !== "string"){
            //key is key/value map
            oldOptions(key);
            newVal = key;
        }else if (typeof value === 'undefined'){
            //accessor
            return oldOptions(key);
        }else{
            //setter
            oldOptions(key,value);
            newVal[key] = value;
        }
        
        if (newVal.adapter){
            _blanket._loadFile(newVal.adapter);
        }
        if (newVal.loader){
            _blanket._loadFile(newVal.loader);
        }
    },
    requiringFile: function(filename,done){
        if (typeof filename === "undefined"){
            _blanket.outstandingRequireFiles=[];
        }else if (typeof done === "undefined"){
            _blanket.outstandingRequireFiles.push(filename);
        }else{
            _blanket.outstandingRequireFiles.splice(_blanket.outstandingRequireFiles.indexOf(filename),1);
        }
    },
    requireFilesLoaded: function(){
        return _blanket.outstandingRequireFiles.length === 0;
    },
    _loadFile: function(path){
        if (typeof path !== "undefined"){
            var request = new XMLHttpRequest();
            request.open('GET', path, false);
            request.send();
            //load the adapter
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.text = request.responseText;
            (document.body || document.getElementsByTagName('head')[0]).appendChild(script);
        }
    },
    hasAdapter: function(callback){
        return _blanket.options("adapter") !== null;
    },
    report: function(coverage_data){
        coverage_data.files = window._$blanket;
        if (_blanket.options("reporter")){
            require([_blanket.options("reporter").replace(".js","")],function(r){
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
        //_blanket.options("filter",scripts);
        if (scripts.length === 0){
            callback();
        }else{
            var requireConfig = {
                paths: {},
                shim: {}
            };
            var lastDep = {
                deps: []
            };
            var isOrdered = _blanket.options("orderedLoading");
            var initialGet=[];
            scripts.forEach(function(file,indx){
                //for whatever reason requirejs
                //prefers when we don't use the full path
                //so we just use a custom name
                var requireKey = "blanket_"+indx;
                initialGet.push(requireKey);
                requireConfig.paths[requireKey] = file;
                if (isOrdered){
                    if (indx > 0){
                       requireConfig.shim[requireKey] = copy(lastDep);
                    }
                    lastDep.deps = [requireKey];
                }
            });
            require.config(requireConfig);
            /*
            var filt = _blanket.options("filter");
            if (!filt){
                filt = scripts;
                _blanket.options("filter",filt);
            }
            if (typeof filt === "string"){
                filt = [filt];
            }
            filt = filt.map(function(val,indx){
                return "blanket_"+indx;
            });
            */
            var filt = initialGet;
            require(filt, function(){
                callback();
            });
        }
    },
    beforeStartTestRunner: function(opts){
        opts = opts || {};
        opts.checkRequirejs = typeof opts.checkRequirejs === "undefined" ? true : opts.checkRequirejs;
        opts.callback = opts.callback || function() {  };
        opts.coverage = typeof opts.coverage === "undefined" ? true : opts.coverage;
        if (opts.coverage) {
            _blanket._bindStartTestRunner(opts.bindEvent,
            function(){
                _blanket._loadSourceFiles(function() {
                    var allLoaded = function(){
                        return opts.condition ? opts.condition() : _blanket.requireFilesLoaded();
                    };
                    var check = function() {
                        if (allLoaded()) {
                            opts.callback();
                        } else {
                            setTimeout(check, 13);
                        }
                    };
                    check();
                });
            });
        }else{
            opts.callback();
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