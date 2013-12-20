define
  toDom: (text) ->
    # This is a contrived example, this approach is not realistic,
    # just used as a demonstration.
    node = document.createElement('div')
    node.innerHTML = text
    return node.firstChild
