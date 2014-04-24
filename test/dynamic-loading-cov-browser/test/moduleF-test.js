module('ModuleF_REQUIREJS');

require(['src/moduleF-requirejs'], function (ModuleF_REQUIREJS) {
  var target = new ModuleF_REQUIREJS();

  test('should return "Hello!"', function() {
    ok(target.show() === 'Hello!');
  });

  test('should work correctly when require same module twice', function() {
    ok(target.show() === 'Hello!');
  });
});
