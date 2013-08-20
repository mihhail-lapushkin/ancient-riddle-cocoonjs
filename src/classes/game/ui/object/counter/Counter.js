Kinetic.Counter = (function() {
  var ANIMATION_TIME = 0.5;
  var EXPAND = 1.2;

  var Class = $.Class({
    _init_: function(config) {
      Kinetic.Group.call(this, config);

      this.on('heightChange', this._syncDimensions);
      this.on('valueChange', this._valueChanged);

      this._origOpacity = this.getOpacity();
      this._initCounter();
      this._syncDimensions();
    },

    _addDigitImage: function() {
      var img = new Kinetic.ProportionalImage({
        listening: false
      });
      img.on('heightChange', function(evt) {
        evt.cancelBubble = true;
      });
      this.add(img);

      return img;
    },

    _toDigitArr: function(num) {
      num = Math.abs(num) + '';
      num = num.length > this.getSize() ? '9'.times(this.getSize()) : num;
      return num.split('');
    },

    _calcWidth: function(n, w, minusPadding) {
      var p = this.getPadding();
      return (n * w * ((1 + p) + (minusPadding ? -p : 0)));
    },

    _syncDimensions: function() {
      var newHeight = this.getHeight();
      var dw;

      this.getChildren().forEach(function(digit, i) {
        digit.setHeight(newHeight);
        digit.setX(this._calcWidth(i, dw = digit.getWidth()));
        digit.setY(0);
      }.bind(this));

      if (dw !== undefined) {
        this.setWidth(this._calcWidth(this.size(), dw, true));
        this.setSizeWidth(this._calcWidth(this.getSize(), dw, true));
      }
    },

    _animateValueChange: function() {
      this.to({
        duration: ANIMATION_TIME,
        easing: 'StrongEaseOut',
        opacity: 1,
        scaleX: EXPAND,
        scaleY: EXPAND,
        callback: function() {
          this.to({
            duration: ANIMATION_TIME,
            easing: 'StrongEaseIn',
            opacity: this._origOpacity,
            scaleX: 1,
            scaleY: 1
          });
        }
      });
    },

    _removeUnusedImages: function(valueDigits) {
      while (this.size() > valueDigits.length) {
        this.getChildren().last().remove();
      }
    },

    _getSignLabel: function(v) {
      return v < 0 ? 'neg' : 'pos';
    },

    _initCounter: function() {
      var v = this.getValue();
      this._updateCounter(this._toDigitArr(v), this._getSignLabel(v));
    },

    _updateCounter: function(valueDigits, sign) {
      var digits = this.getChildren();
      valueDigits.forEach(function(valueDigit, i) {
        var digit = digits[i];

        if (!digit) {
          digit = this._addDigitImage();
        }

        digit.setImage(Image.digit[sign][valueDigit]);
      }.bind(this));
    },

    _valueChanged: function(evt) {
      evt.cancelBubble = true;

      var newVal = parseInt(evt.newVal, 10);
      var oldVal = parseInt(evt.oldVal, 10);

      if (newVal === oldVal) return;

      var valueDigits = this._toDigitArr(newVal);

      this._removeUnusedImages(valueDigits);
      this._updateCounter(valueDigits, this._getSignLabel(newVal));
      this._syncDimensions();

      if (this.isAnimate() && this.getVisible() && this.getAbsoluteOpacity() > 0) {
        this._animateValueChange();
      } else {
        this.getLayer().draw();
      }

      if (this.isTicking()) {
        this._playChangeSound();
      }
    },

    _playChangeSound: function() {
      AudioManager.play(Audio.sound.tick);
    },

    isAnimate: function() {
      return this.getAnimate();
    },

    isTicking: function() {
      return this.getTicking();
    }
  });

  Kinetic.Util.extend(Class, Kinetic.Group);
  Kinetic.Factory.addGetterSetter(Class, 'value', 0);
  Kinetic.Factory.addGetterSetter(Class, 'padding', 0);
  Kinetic.Factory.addGetterSetter(Class, 'animate', true);
  Kinetic.Factory.addGetterSetter(Class, 'ticking', false);
  Kinetic.Factory.addGetterSetter(Class, 'size', 2);
  Kinetic.Factory.addGetterSetter(Class, 'sizeWidth');

  return Class;
})();