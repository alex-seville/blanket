module('ModuleE_REPLACECHILD');

asyncTest('show() should return "Hello!"', function () {
  var module = new ModuleE_REPLACECHILD(),
      url = 'src/moduleE.js';

  module.load(url, function () {
    ok(module.show() === 'Hello!');
    start();
  });
});
