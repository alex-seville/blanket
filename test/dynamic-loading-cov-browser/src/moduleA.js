(function (exports) {
  'use strict';

  function ModuleA () {

  }

  ModuleA.prototype = {

    greets: function () {
      return 'Hello!';
    }

  };

  exports.ModuleA = ModuleA;

})(this);
