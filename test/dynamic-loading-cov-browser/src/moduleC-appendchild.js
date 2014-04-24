(function (exports) {
  'use strict';

  function ModuleC_APPENDCHILD() {

  }

  ModuleC_APPENDCHILD.prototype = {

    load: function (url, callback) {
      var script = document.createElement('script');
      script.src = url;
      script.onload = callback;
      document.head.appendChild(script);
    },

    show: function () {
      return new ModuleC().greets();
    }

  };

  exports.ModuleC_APPENDCHILD = ModuleC_APPENDCHILD;

})(this);
