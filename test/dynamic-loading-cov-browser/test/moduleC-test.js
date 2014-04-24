module('ModuleC_APPENDCHILD');

asyncTest('show() should return "Hello!"', function () {
  var module = new ModuleC_APPENDCHILD();

  module.load('src/moduleC.js', function () {
    ok(module.show() === 'Hello!');
    start();
  });
});
