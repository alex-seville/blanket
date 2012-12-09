var globalFilter,customReporter,adapter;
//http://stackoverflow.com/a/2954896
var toArray =Array.prototype.slice;
var scripts = toArray.call(document.scripts);
toArray.call(scripts[scripts.length - 1].attributes)
                .forEach(function(es){
                    if(es.nodeName === "data-cover-only"){
                        globalFilter = es.nodeValue;
                    }
                    if(es.nodeName === "data-cover-reporter"){
                        customReporter = es.nodeValue;
                    }
                    if (es.nodeName === "data-cover-adapter"){
                        adapter = es.nodeValue;
                    }
                });
blanket.setFilter(globalFilter);
blanket.setReporter(customReporter);
blanket.setAdapter(adapter);