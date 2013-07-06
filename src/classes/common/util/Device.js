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
        Env.callAPI('forceToFinish');
      } else {
        window.close();
      }
    },
    
    is: function(device) {
      var deviceRx = new RegExp(device, 'i');
      
      return deviceRx.test(navigator.userAgent) || deviceRx.test(navigator.appVersion);
    }
  };
})();