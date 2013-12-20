define [
  'cs!controller'
  'cs!view'
  'regular'
], (controller, view, regular) ->
  controller.attach view
  console.log 'regular name is: ' + regular.name
