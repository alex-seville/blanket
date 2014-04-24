(function (exports) {
  'use strict';

  function ModuleC () {

  }

  ModuleC.prototype = {

    greets: function () {
      return 'Hello!';
    }

  };

  exports.ModuleC = ModuleC;

})(this);
