(function (exports) {
  'use strict';

  function ModuleE_REPLACECHILD() {

  }

  ModuleE_REPLACECHILD.prototype = {

    load: function (url, callback) {
      var div = document.createElement('div'),
          script = document.createElement('script');

      div.setAttribute('id', 'replace-target');
      document.body.appendChild(div);

      script.src = url;
      script.onload = callback;

      div.parentNode.replaceChild(script, div);
    },

    show: function () {
      return new ModuleE().greets();
    }

  };

  exports.ModuleE_REPLACECHILD = ModuleE_REPLACECHILD;

})(this);
