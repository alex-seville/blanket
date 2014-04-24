module('ModuleD_INSERTBEFORE');

asyncTest('show() should return "Hello!"', function () {
  var module = new ModuleD_INSERTBEFORE();

  module.load('src/moduleD.js', function () {
    ok(module.show() === 'Hello!');
    start();
  });
});
