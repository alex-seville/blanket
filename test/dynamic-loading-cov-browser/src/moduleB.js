(function (exports) {
  'use strict';

  function ModuleB () {

  }

  ModuleB.prototype = {

    greets: function () {
      return 'Hello!';
    }

  };

  exports.ModuleB = ModuleB;

})(this);
