define(['src/moduleF'], function(ModuleF){
  'use strict';

  function ModuleF_REQUIREJS() {

  }

  ModuleF_REQUIREJS.prototype = {

    show: function () {
        return new ModuleF().greets();
    }

  };

  return ModuleF_REQUIREJS;
});
