define ['domReady'], (domReady) ->
  attach: (view) ->
    # Just a simple demonstration of some modules cooperating.
    domReady ->
      view.render document.getElementsByTagName('body')[0]
