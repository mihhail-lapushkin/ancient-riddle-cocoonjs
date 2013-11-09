Kinetic.GameOver = (function() {
  var SIDE_ANIMATION_TIME = 0.7;
  var COUNT_TO_ZERO_TIME = 1.8;
  var COUNT_TO_TURNS_TIME = 1.8;
  var MERGE_MOVE_ANIMATION_TIME = 1.4;
  var MERGE_MOVE_DELAY = 0.4;
  var MERGE_OPACITY = 0.5;
  var SCORE_INCREMENT_TIME = 1.1;
  var SCORE_FINAL_FADE_OUT_TIME = 0.7;
  var SIGN_FADE_OUT_TIME = 0.8;
  var LOCK_FADE_OUT_TIME = 0.7;
  var BLINK_TIME = 0.4;
  var LONG_BLINK_TIME = 0.8;

  var TEXT_HEIGHT = 6;
  var SCORE_TEXT_X = 0.2;
  var SCORE_TEXT_HEIGHT = 0.4;
  var TURNS_X = 0.3;
  var TURNS_RADIUS = 6;
  var SCORE_X = 0.23;
  var SCORE_RADIUS = 9;
  var RIGHT_SIDE_EXTEND = 0.44;

  var BLINKING_TEXT = 'blinkingText';
  var SCORE_DELTA_SIGN = 'scoreSign';

  var Class = $.Class({
    _init_: function(config) {
      Kinetic.AbstractSlidingContainer.call(this, config);

      this._build();
    },

    _build: function() {
      var w = this.getWidth();
      var h = this.getHeight();

      this._createBlinkingText('highScore');
      this._createBlinkingText('worseScore');
      this._createBlinkingText('sameScore');
      this._createBlinkingText('completed');
      this._createBlinkingText('skipped');
      this._createBlinkingText('unlocked');

      this.add(this.pressCatcher = new Kinetic.PressCatcher({
        width: w,
        height: h,
        visible: false,
        onPress: this._skipAnimation.bind(this)
      }));
    },
    
    _createBlinkingText: function(name) {
      var unit = this.attrs.unit;

      this.add(this[name] = new Kinetic.ProportionalImage({
        name: BLINKING_TEXT,
        height: unit * TEXT_HEIGHT,
        image: Image.text[name],
        opacity: 0,
        visible: false
      }));

      this.center(this[name]);
    },

    _rebuildRightSide: function() {
      var padding = this.attrs.padding * 2;
      var unit = this.attrs.unit;
      var w = this.getWidth();
      var h = this.getHeight();

      if (this.rightSide.scoreText) this.rightSide.scoreText.destroy();

      this.rightSide.add(this.rightSide.scoreText = new Kinetic.ProportionalImage({
        x: w * SCORE_TEXT_X,
        y: padding,
        height: h * SCORE_TEXT_HEIGHT,
        image: Image.text.score
      }));

      if (this.rightSide.turns) this.rightSide.turns.destroy();

      this.rightSide.add(this.rightSide.turns = new Kinetic.CircledCounter({
        x: w * TURNS_X,
        y: padding,
        radius: unit * TURNS_RADIUS
      }));

      if (this.rightSide.score) this.rightSide.score.destroy();

      this.rightSide.add(this.rightSide.score = new Kinetic.ProgressCircle({
        x: w * SCORE_X,
        y: h - unit * SCORE_RADIUS * 2 - padding,
        radius: unit * SCORE_RADIUS,
        size: 'large',
        listening: false
      }));
    },

    _traverseGroups: function(n, f) {
      f(n);

      if (n.nodeType === 'Group') {
        n.getChildren().clone().forEach(function(gn) {
          this._traverseGroups(gn, f);
        }.bind(this));
      }
    },

    _blinkText: function(name, t, callback) {
      this[name].show();
      this[name].to({
        duration: t ? t : BLINK_TIME,
        opacity: 1,
        callback: function() {
          this[name].to({
            duration: t ? t : BLINK_TIME,
            opacity: 0,
            callback: function() {
              this[name].hide();
              
              if (callback) callback();
            }.bind(this)
          });
        }.bind(this)
      });
    },
    
    _hasEnded: function() {
      return !this.pressCatcher.isVisible();
    },

    _skipAnimation: function() {
      this._traverseGroups(this, function(node) {
        switch (node.getName()) {
          case BLINKING_TEXT:
            node.hide();
            break;
          case SCORE_DELTA_SIGN:
            node.destroy();
            break;
          default:
            node.destroyTween();
        }
      });

      if (this._scoreIsMoving) {
        this.rightSide.score.hide();
        this._scoreIsMoving = false;
      }

      this._blinkText('skipped');
      this._hideAll(this.fire.bind(this, 'animationSkipped'));
    },

    animateCountingScore: function(args) {
      this._rebuildRightSide();

      var turns = args.turns;
      var solution = args.solution;
      var score = args.score;

      this.rightSide.turns.setValue(solution);
      this.rightSide.score.nullify();

      this._showSide({
        side: this.rightSide,
        extend: RIGHT_SIDE_EXTEND,
        duration: SIDE_ANIMATION_TIME,
        callback: function() {
          this.pressCatcher.show();
          this._countToZero(turns, score, args.callback);
        }.bind(this)
      });
    },

    _countToZero: function(turns, score, callback) {
      this.rightSide.turns.tickingOn();
      this.rightSide.turns.to({
        value: Math.max(turns, 0),
        duration: COUNT_TO_ZERO_TIME * 4 / 5,
        easing: 'EaseOut'
      });
      
      if (score < 1) {
        this.rightSide.score.setShowCompleted(false);
      }
      
      this.rightSide.score.to({
        percent: 1,
        duration: COUNT_TO_ZERO_TIME,
        easing: 'SoftBackEaseOut',
        callback: this._countToTurns.bind(this, turns, score, callback)
      });
    },

    _countToTurns: function(turns, score, callback) {
      if (turns < 0) {
        this.rightSide.turns.to({
          value: turns,
          duration: COUNT_TO_TURNS_TIME * 2 / 3,
          easing: 'EaseOut'
        });

        this.rightSide.score.to({
          percent: score,
          duration: COUNT_TO_TURNS_TIME,
          easing: 'SoftBackEaseOut',
          callback: callback
        });
      } else {
        this._blinkText('completed', LONG_BLINK_TIME, callback);
      }
    },

    animateMergingScore: function(args) {
      var mergeFrom = this.rightSide.score;
      var mergeWith = args.mergeWith;
      var scaleTo = mergeWith.getRadius() / mergeFrom.getRadius();
      var moveTo = mergeFrom.toLocalOf(mergeWith);

      this._scoreIsMoving = true;
      mergeFrom.to({
        x: moveTo.x,
        y: moveTo.y,
        scaleX: scaleTo,
        scaleY: scaleTo,
        opacity: MERGE_OPACITY,
        duration: MERGE_MOVE_ANIMATION_TIME,
        easing: 'EaseInOut',
        callback: function() {
          $.delay(MERGE_MOVE_DELAY, function() {
            if (this._hasEnded()) return;
            
            this._animateScoreComparison(mergeFrom, mergeWith, args.callback);
          }.bind(this));
        }.bind(this)
      });
    },

    _animateScoreComparison: function(mergeFrom, mergeWith, callback) {
      var newPercent = mergeFrom.getPercent().toFixed(5);
      var lastPercent = mergeWith.getPercent().toFixed(5);

      if (newPercent > lastPercent) {
        this._animateNewHighScore(mergeFrom, mergeWith, callback);
      } else if (newPercent < lastPercent) {
        this._animateWorseScore(mergeFrom, callback);
      } else {
        this._animateSameScore(mergeFrom, callback);
      }
    },

    _animateNewHighScore: function(mergeFrom, mergeWith, callback) {
      this._blinkText('highScore', LONG_BLINK_TIME);
      this._showScoreChangeSign('plus', mergeFrom, function() {
        mergeWith.to({
          percent: mergeFrom.getPercent(),
          duration: SCORE_INCREMENT_TIME,
          easing: 'SoftBackEaseOut',
          callback: function() {
            mergeFrom.hide();
            this._hideAll(callback);
          }.bind(this)
        });
      }.bind(this));
    },

    _animateWorseScore: function(mergeFrom, callback) {
      this._blinkText('worseScore', LONG_BLINK_TIME);
      this._showScoreChangeSign('minus', mergeFrom, function() {
        mergeFrom.to({
          opacity: 0,
          duration: SCORE_FINAL_FADE_OUT_TIME,
          callback: this._hideAll.bind(this, callback)
        });
      }.bind(this));
    },

    _animateSameScore: function(mergeFrom, callback) {
      this._blinkText('sameScore', LONG_BLINK_TIME);
      this._showScoreChangeSign('equal', mergeFrom, function() {
        mergeFrom.hide();
        this._hideAll(callback);
      }.bind(this));
    },

    _showScoreChangeSign: function(sign, circle, callback) {
      sign = this._addSameSizedImage(circle, Image.icon[sign]);

      sign.to({
        opacity: 0,
        duration: SIGN_FADE_OUT_TIME,
        easing: 'EaseIn',
        callback: function() {
          sign.destroy();
          callback();
        }
      });
    },

    _addSameSizedImage: function(circle, img) {
      var image = new Kinetic.Image({
        name: SCORE_DELTA_SIGN,
        x: circle.getX(),
        y: circle.getY(),
        width: circle.getRadius() * 2,
        height: circle.getRadius() * 2,
        scaleX: circle.getScaleX(),
        scaleY: circle.getScaleY(),
        image: img
      });

      circle.getParent().add(image);

      return image;
    },
    
    animateUnlocking: function(args) {
      this._blinkText('unlocked', LONG_BLINK_TIME, function() {
        args.levelCircle.clear();
        args.lockIcon.to({
          opacity: 0,
          duration: LOCK_FADE_OUT_TIME,
          easing: 'EaseIn',
          callback: args.callback
        });
      });
    },

    _hideAll: function(callback) {
      if (this._hasEnded()) return;
      
      this._scoreIsMoving = false;
      this.pressCatcher.hide();

      this._hideRightSide(SIDE_ANIMATION_TIME, callback);
    }
  });

  Kinetic.Util.extend(Class, Kinetic.AbstractSlidingContainer);

  return Class;
})();