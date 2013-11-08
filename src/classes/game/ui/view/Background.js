Kinetic.Background = (function() {
  var ANIMATION_TIME = 0.5;

  var Class = $.Class({
    _init_: function(config) {
      config.listening = false;

      Kinetic.Group.call(this, config);

      this.add(this.normal = this._createImage(Image.bg.normal));
      this.add(this.gs = this._createImage(Image.bg.gs));
    },

    _createImage: function(img) {
      return new Kinetic.Image({
        width: this.getWidth(),
        height: this.getHeight(),
        image: img
      });
    },

    toGrayscale: function(callback) {
      this.gs.show();
      this.gs.to({
        duration: ANIMATION_TIME,
        opacity: 1,
        callback: callback
      });
    },

    toColor: function(callback) {
      this.gs.to({
        duration: ANIMATION_TIME,
        opacity: 0,
        callback: function() {
          this.gs.hide();
          if (callback) callback();
        }.bind(this)
      });
    }
  });

  Kinetic.Util.extend(Class, Kinetic.Group);

  return Class;
})();