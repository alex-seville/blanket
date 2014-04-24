module('ModuleB_XHR');

asyncTest('show() should return "Hello!"', function () {
  var module = new ModuleB_XHR();

  module.load('src/moduleB.js', function () {
    ok(module.show() === 'Hello!');
    start();
  });
});
