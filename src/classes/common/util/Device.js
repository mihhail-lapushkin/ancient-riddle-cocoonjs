Device = (function() {
  var DEFAULT_VIBRATION_TIME = 20;

  return {
    cancelVibration: function() {
      if (navigator.vibrate) {
        navigator.vibrate(0);
      }
    },

    vibrate: function(t) {
      if (navigator.vibrate) {
        this.cancelVibration();

        navigator.vibrate(t || DEFAULT_VIBRATION_TIME);
      }
    },

    quitApp: function() {
      if (Env.isCocoonJS) {
        Env.callAPI('IDTK_APP', 'forceToFinish');
      } else {
        window.close();
      }
    },
    
    is: function(devices) {
      if (!Array.isArray(devices)) {
        devices = [ devices ];
      }

      for (var i = 0; i < devices.length; i++) {
        var deviceRx = new RegExp(devices[i], 'i');
      
        if (deviceRx.test(navigator.userAgent) || deviceRx.test(navigator.appVersion)) {
          return true;
        }
      }
      
      return false;
    }
  };
})();