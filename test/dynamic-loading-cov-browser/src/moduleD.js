(function (exports) {
  'use strict';

  function ModuleD () {

  }

  ModuleD.prototype = {

    greets: function () {
      return 'Hello!';
    }

  };

  exports.ModuleD = ModuleD;

})(this);
