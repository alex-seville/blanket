define ['cs!util'], (util) ->
  render: (body) ->
    body.appendChild util.toDom('<b>This is a rendered view</b>')
