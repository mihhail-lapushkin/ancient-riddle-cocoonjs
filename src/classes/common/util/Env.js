Env = (function() {
  var env = {
    PHONEGAP: {
      is: window.PhoneGap !== undefined,
      name: 'PhoneGap'
    },
    DIRECT_CANVAS: {
      is: window.AppMobi !== undefined,
      name: 'DirectCanvas'
    },
    COCOON_JS: {
      is: navigator.isCocoonJS !== undefined,
      name: 'CocoonJS',
      methods: {
        callAPI: function(service) {
          var api = window.ext[service];
          api.makeCall.apply(api, Array.prototype.slice.call(arguments, 1));
        }
      }
    },
    DEV: {
      name: 'Dev'
    }
  };

  var envObjects = {};
  var currEnv;

  for (var key in env) {
    var val = env[key];

    var o = envObjects[key] = {};

    if (val.is) {
      currEnv = o;
    }
    
    if (val.methods) {
      for (var m in val.methods) {
        envObjects[key][m] = val.methods[m];
      }
    }
  }

  if (!currEnv) {
    env.DEV.is = true;
    currEnv = envObjects.DEV;
  }

  for (var k1 in env) {
    var o = envObjects[k1];
    for (var k2 in env) {
      o[k2] = envObjects[k2];
      o['is' + env[k2].name] = env[k2].is;
    }
  }

  return currEnv;
})();