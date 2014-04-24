(function (exports) {
  'use strict';

  function ModuleD_INSERTBEFORE() {

  }

  ModuleD_INSERTBEFORE.prototype = {

    load: function (url, callback) {
      var script = document.createElement('script');
      script.src = url;
      script.onload = callback;
      document.head.insertBefore(script, document.scripts[0]);
    },

    show: function () {
      return new ModuleD().greets();
    }

  };

  exports.ModuleD_INSERTBEFORE = ModuleD_INSERTBEFORE;

})(this);
