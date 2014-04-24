module('ModuleA_HTML');

test('show() should return "Hello!"', function () {
  var target = new ModuleA_HTML();
  ok(target.show() === 'Hello!');
});
