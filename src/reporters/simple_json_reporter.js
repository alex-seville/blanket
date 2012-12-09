define([],function simple_json_reporter(){
    
    var body = document.body;

    var appendHtml = function (el, str) {
        var div = document.createElement('div');
        div.innerText = str;
        el.appendChild(div);
    };
    
    return function(coverageData){
        appendHtml(body, JSON.stringify(coverageData,null,"\t"));
    };
});