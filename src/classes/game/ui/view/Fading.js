Kinetic.Fading = (function() {
  var LONG_TIME = 4.2;
  var FAST_TIME = 1;

  var Class = $.Class({
    _init_: function(config) {
      config.fill = 'black';
      config.listening = false;

      Kinetic.Rect.call(this, config);
    },

    fadeOut: function(dur, callback) {
      this.to({
        opacity: 0,
        easing: 'EaseIn',
        duration: dur,
        callback: function() {
          this.destroy();
          if (callback) callback();
        }
      });
    },

    longFadeOut: function(callback) {
      this.fadeOut(LONG_TIME, callback);
    },

    fastFadeOut: function(callback) {
      this.fadeOut(FAST_TIME, callback);
    }
  });

  Kinetic.Util.extend(Class, Kinetic.Rect);

  return Class;
})();