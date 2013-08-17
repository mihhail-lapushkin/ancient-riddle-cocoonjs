Kinetic.HUD = (function() {
  var FADE_TIME = 1;
  var TURNS_ANIMATION_TIME = 1;
  var LIMIT_ANIMATION_STEP_TIME = 1;
  var TAPS_LOST_STEP_ANIMATION_TIME = 0.5;
  var OPACITY = 0.6;

  var TURNS_HEIGHT = 5;
  var PAUSE_SIZE = 6;
  var LIMIT_WIDTH = 0.65;
  var TAPS_LOST_NUMBER_HEIGHT = 4;
  var TAPS_LOST_TEXT_TO_NUMBER_WIDTH = 1.8;

  var Class = $.Class({
    _init_: function(config) {
      Kinetic.Group.call(this, config);

      this._build();

      this.on('turnsValChange', this._onTurnsAnim);
    },

    _build: function() {
      var padding = this.attrs.padding;
      var unit = this.attrs.unit;
      var w = this.getWidth();
      var pauseSize = unit * PAUSE_SIZE;

      this.add(this.turns = new Kinetic.Counter({
        listening: false,
        x: padding,
        y: padding,
        height: unit * TURNS_HEIGHT,
        opacity: OPACITY
      }));

      this.add(this.pause = new Kinetic.SimpleButton({
        x: w - padding - pauseSize,
        y: padding,
        width: pauseSize,
        height: pauseSize,
        opacity: OPACITY,
        image: Image.button.pause,
        onPress: function() { this.fire('paused'); }.bind(this)
      }));

      this.add(this.limit = new Kinetic.ProportionalImage({
        x: this.turns.getSizeWidth() + padding * 2,
        width: w * LIMIT_WIDTH,
        listening: false,
        image: Image.text.limit,
        opacity: 0
      }));

      this.limit.setY(-this.limit.getHeight());
    },

    tapPause: function() {
      var p = this.pause;

      if (p.isVisible() && p.isListening()) {
        p.fire('tap');
      }
    },

    setTurns: function(args) {
      if (args.animate) {
        this.to({
          duration: TURNS_ANIMATION_TIME,
          turnsVal: args.value,
          callback: args.callback
        });
      } else {
        this.setTurnsVal(args.value);
        if (args.callback) args.callback();
      }
    },

    _onTurnsAnim: function(evt) {
      this.turns.setValue(evt.newVal);

      if (evt.oldVal >= 0 && evt.newVal < 0) {
        this._animateNegativeBorderCrossing();
      }
    },

    _animateNegativeBorderCrossing: function() {
      var y = this.limit.getY();

      this.limit.to({
        duration: LIMIT_ANIMATION_STEP_TIME,
        easing: 'BackEaseOut',
        y: this.attrs.padding,
        opacity: OPACITY,
        callback: function() {
          $.delay(LIMIT_ANIMATION_STEP_TIME, function() {
            this.to({
              duration: LIMIT_ANIMATION_STEP_TIME,
              easing: 'BackEaseIn',
              opacity: 0,
              callback: function() { this.setY(y); }
            });
          }.bind(this));
        }
      });
    },
    
    _createTapsLostNumber: function(args) {
      var padding = this.attrs.padding;
      
      var g = new Kinetic.Group({
        x: args.position.x,
        y: args.position.y,    
        opacity: OPACITY,
        listening: false
      });
      
      var number = new Kinetic.Counter({
        height: this.attrs.unit * TAPS_LOST_NUMBER_HEIGHT,
        value: -args.number,
        animate: false
      });
      
      var text = new Kinetic.ProportionalImage({
        width: number.getWidth() * TAPS_LOST_TEXT_TO_NUMBER_WIDTH,
        image: Image.text.tapsLost
      });
      
      number.setX((text.getWidth() - number.getWidth()) / 2);
      text.setY(number.getHeight() + padding / 2);

      g.add(number);
      g.add(text);

      g.setOffset(text.getWidth() / 2, (text.getY() + text.getHeight()) / 2);
      
      return g;
    },

    floatTapsLost: function(args) {
      var tapsLost = this._createTapsLostNumber(args);

      this.add(tapsLost);
      
      tapsLost.to({
        duration: TAPS_LOST_STEP_ANIMATION_TIME,
        easing: 'StrongEaseOut',
        scaleX: 1.5,
        scaleY: 1.5,
        callback: function() {
          this.to({
            duration: TAPS_LOST_STEP_ANIMATION_TIME,
            easing: 'EaseIn',
            opacity: 0,
            scaleX: 0.5,
            scaleY: 0.5,
            callback: function() { this.destroy(); }
          });
        }
      });
    },

    fadeIn: function(callback) {
      this.to({
        opacity: 1,
        duration: FADE_TIME,
        easing: 'EaseOut',
        callback: callback
      });
    }
  });

  Kinetic.Util.extend(Class, Kinetic.Group);
  Kinetic.Factory.addGetterSetter(Class, 'turnsVal');

  return Class;
})();