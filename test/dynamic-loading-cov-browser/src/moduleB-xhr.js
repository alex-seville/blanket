(function (exports) {
  'use strict';

  function ModuleB_XHR() {

  }

  ModuleB_XHR.prototype = {

    load: function (url, callback) {
      var xhr = new XMLHttpRequest();

      xhr.open('GET', url, true);

      xhr.onload = function () {
        // Execute response script
        window.eval(xhr.response);

        if (callback) {
          callback();
        }
      };

      xhr.send();
    },

    show: function () {
      return new ModuleB().greets();
    }

  };

  exports.ModuleB_XHR = ModuleB_XHR;

})(this);
