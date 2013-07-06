Gesture = (function() {
  var SWIPE_MAX_TIME = 500;
  var SWIPE_MIN_DIST = 30;
  var SWIPE_MAX_WRONG_DIST = 75;

  var swipeListeners = [];
  var swipeEvent = {};

  function notifySwipeListeners(evt) {
    swipeListeners.forEach(function(l) {
      l(evt);
    });
  }

  function registerInputListeners() {
    Event.bind(window, 'mousedown touchstart', detectSwipeStart);
    Event.bind(window, 'mousemove touchmove', detectSwipeMove);
    Event.bind(window, 'mouseup touchend', detectSwipeEnd);
  }

  function detectSwipeStart(evt) {
    evt.preventDefault();

    var evt = evt.touches ? evt.touches[0] : evt;

    swipeEvent.t1 = new Date().getTime();
    swipeEvent.x1 = evt.pageX;
    swipeEvent.y1 = evt.pageY;
  }

  function detectSwipeMove(evt) {
    evt.preventDefault();

    var evt = evt.touches ? evt.touches[0] : evt;

    swipeEvent.x2 = evt.pageX;
    swipeEvent.y2 = evt.pageY;
  }

  function detectSwipeEnd(evt) {
    evt.preventDefault();

    swipeEvent.t2 = new Date().getTime();

    if (swipeEvent.t2 - swipeEvent.t1 < SWIPE_MAX_TIME) {
      var dx = Math.abs(swipeEvent.x1 - swipeEvent.x2);
      var dy = Math.abs(swipeEvent.y1 - swipeEvent.y2);

      if (dx >= SWIPE_MIN_DIST && dy < SWIPE_MAX_WRONG_DIST) {
        if (swipeEvent.x1 > swipeEvent.x2) {
          notifySwipeListeners($.copy({ dir: 'w' }, swipeEvent));
        } else {
          notifySwipeListeners($.copy({ dir: 'e' }, swipeEvent));
        }
      } else if (dy >= SWIPE_MIN_DIST && dx < SWIPE_MAX_WRONG_DIST) {
        if (swipeEvent.y1 > swipeEvent.y2) {
          notifySwipeListeners($.copy({ dir: 'n' }, swipeEvent));
        } else {
          notifySwipeListeners($.copy({ dir: 's' }, swipeEvent));
        }
      }
    }
  }

  return {
    swiped: function(fn) {
      if (swipeListeners.isEmpty()) {
        registerInputListeners();
      }

      swipeListeners.add(fn);
    }
  };
})();