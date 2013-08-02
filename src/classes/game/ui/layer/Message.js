Kinetic.Message = (function() {
  var TEXT_HEIGHT = 5.5;
  var TEXT_MAX_OPACITY = 0.8;
  var FADE_IN_TIME = 1.5;
  var FADE_OUT_TIME = 0.8;
  var FADE_IN_DELAY = 0.3;

  var Class = $.Class({
    _init_: function(config) {
      config.listening = false;

      Kinetic.Group.call(this, config);
    },
    
    _prepareText: function(pathArr, opacity) {
      var w = this.getWidth();
      var h = this.getHeight();
      var unit = this.attrs.unit;

      this.add(this.text = new Kinetic.ProportionalImage({
        height: TEXT_HEIGHT * unit,
        opacity: opacity,
        image: this._getTextImage(pathArr)
      }));

      this.center(this.text);
    },
    
    _getTextImage: function(pathArr) {
      for (var i = 0, p = Image.text; i < pathArr.length; i++) {
        p = p[pathArr[i]];
      }
      
      return p;
    },
    
    setToFadeOut: function() {
      this._prepareText(arguments, TEXT_MAX_OPACITY);
    },
    
    fadeIn: function() {
      this._prepareText(arguments, 0);
      
      this.text.to({
        duration: FADE_IN_TIME,
        opacity: TEXT_MAX_OPACITY
      });
    },
    
    delayedFadeIn: function() {
      var args = arguments;
      $.delay(FADE_IN_DELAY, function() {
        this.fadeIn.apply(this, args);
      }.bind(this));
    },

    fadeOut: function(callback) {
      if (!this.text) return;
      
      this.text.to({
        duration: FADE_OUT_TIME,
        opacity: 0,
        callback: function() {
          this.text.destroy();
          delete this.text;
          if (callback) callback();
        }.bind(this)
      });
    }
  });

  Kinetic.Util.extend(Class, Kinetic.Group);

  return Class;
})();