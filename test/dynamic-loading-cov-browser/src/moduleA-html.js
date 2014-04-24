(function (exports) {
  'use strict';

  function ModuleA_HTML () {

  }

  ModuleA_HTML.prototype = {

    show: function () {
      return new ModuleA().greets();
    }

  };

  exports.ModuleA_HTML = ModuleA_HTML;

})(this);
