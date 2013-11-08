Kinetic.InactiveDisplay = (function() {
  var OPACITY = 0.5;
  var FADE_TIME = 0.6;
  var HEIGHT = 15;

  var Class = $.Class({
    _init_: function(config) {
      config.visible = false;
      config.opacity = 0;

      Kinetic.Group.call(this, config);

      this._build();
    },

    _build: function() {
      var padding = this.attrs.padding;
      var unit = this.attrs.unit;
      var h = this.getHeight();
      var levelHeight = unit * HEIGHT;

      this.add(this.level = new Kinetic.DoubleCounter({
        listening: false,
        x: padding * 3,
        y: h - padding * 2 - levelHeight,
        height: levelHeight,
        padding: padding * 2
      }));
    },

    setLevel: function(d, l) {
      this.level.setValueOne(d);
      this.level.setValueTwo(l);
    },

    fadeIn: function(callback) {
      this.show();
      this.to({
        opacity: OPACITY,
        duration: FADE_TIME,
        easing: 'EaseOut',
        callback: callback
      });
    },

    fadeOut: function(callback) {
      this.to({
        opacity: 0,
        duration: FADE_TIME,
        easing: 'EaseIn',
        callback: function() {
          this.hide();
          if (callback) callback();
        }.bind(this)
      });
    }
  });

  Kinetic.Util.extend(Class, Kinetic.Group);

  return Class;
})();