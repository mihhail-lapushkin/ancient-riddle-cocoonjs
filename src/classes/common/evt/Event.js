Event = (function() {
  var ESC = 27;
  var SPACE = 32;

  function evtBase(funcName, evts, handler, el) {
    if (el) {
      var tmp = evts;
      evts = handler;
      handler = el;
      el = tmp;
    }

    evts.split(' ').forEach(function(evt) {
      ((el ? el : document)[funcName])(evt, handler, false);
    });
  }

  function bind(evts, handler, el) {
    evtBase('addEventListener', evts, handler, el);
  }

  function bindToKey(fn, key) {
    bind(document, 'keyup', function(e) { if (e.keyCode === key) fn(); });
  }

  return {
    bind: bind,

    unbind: function(evts, handler, el) {
      evtBase('removeEventListener', evts, handler, el);
    },

    backPressed: function(fn) {
      switch (Env) {
        case Env.DEV:
          bindToKey(fn, ESC);
          break;
        case Env.COCOON_JS:
          window.onidtkappfinish = fn;
          break;
        case Env.PHONEGAP:
          bind(document, 'backbutton', fn);
          break;
        case Env.DIRECT_CANVAS:
          bind(document, 'appMobi.device.hardware.back', fn);
          break;
      }
    },

    menuPressed: function(fn) {
      switch (Env) {
        case Env.DEV:
          bindToKey(fn, SPACE);
          break;
        case Env.PHONEGAP:
          bind(document, 'menubutton', fn);
          break;
      }
    },

    devicePaused: function(fn) {
      switch (Env) {
        case Env.COCOON_JS:
          Env.callAPI('IDTK_APP', 'App', 'onsuspended');
          break;
        case Env.PHONEGAP:
          bind(document, 'pause', fn);
          break;
        case Env.DIRECT_CANVAS:
          bind(document, 'appMobi.device.pause', fn);
          break;
      }
    },

    deviceResumed: function(fn) {
      switch (Env) {
        case Env.COCOON_JS:
          Env.callAPI('IDTK_APP', 'App', 'onactivated');
          break;
        case Env.PHONEGAP:
          bind(document, 'resume', fn);
          break;
        case Env.DIRECT_CANVAS:
          bind(document, 'appMobi.device.resume', fn);
          break;
      }
    },

    deviceReady: function(fn) {
      switch (Env) {
        case Env.PHONEGAP:
          bind(document, 'deviceready', fn);
          break;
        case Env.DIRECT_CANVAS:
          bind(document, 'appMobi.device.ready', fn);
          break;
      }
    },

    pageLoaded: function(fn) {
      bind(document, 'DOMContentLoaded', fn);
    },

    allFired: function(config) {
      var left = config.events.length;

      var checkDone = function() {
        if (--left === 0) {
          config.callback();
        }
      };

      config.events.forEach(function(evt) {
        evt(checkDone);
      });
    }
  };
})();