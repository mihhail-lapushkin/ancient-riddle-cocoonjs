Kinetic.GameOver = (function() {
	var SIDE_ANIMATION_TIME = 0.7;
	var COUNT_TO_ZERO_TIME = 5;
	var COUNT_TO_TURNS_TIME = 6;
	var MERGE_MOVE_ANIMATION_TIME = 4;
	var MERGE_MOVE_DELAY = 0.7;
	var MERGE_OPACITY = 0.5;
	var SCORE_INCREMENT_TIME = 2;
	var SCORE_FINAL_FADE_OUT_TIME = 1;
	var SIGN_FADE_OUT_TIME = 1;
	var BLINK_TIME = 0.5;
	var LONG_BLINK_TIME = 0.7;

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
		_init: function(config) {
			Kinetic.AbstractSlidingContainer.call(this, config);
			
			this._build();
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
		
		_build: function() {
			var w = this.getWidth();
			var h = this.getHeight();

			this._createBlinkingText('highScore');
			this._createBlinkingText('worseScore');
			this._createBlinkingText('sameScore');
			this._createBlinkingText('completed');
			this._createBlinkingText('skipped');

			this.add(this.tapCatcher = new Kinetic.Rect({
				width: w,
				height: h,
				image: Image.bg.trans,
				visible: false
			}));
			
			this.tapCatcher.on('tap click', this._skipAnimation.bind(this));
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
				n.each(function(n) {
					this._traverseGroups(n, f);
				}.bind(this));
			}
		},
		
		_blinkText: function(name, t) {
			this[name].show();
			this[name].transitionTo({
				duration: t ? t : BLINK_TIME,
				opacity: 1,
				callback: function() {
					this[name].transitionTo({
						duration: t ? t : BLINK_TIME,
						opacity: 0,
						callback: function() {
							this[name].hide();
						}.bind(this)
					});
				}.bind(this)
			});
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
						if (node.trans) {
							node.trans.stop();
						}
				}
			});
			
			if (this._scoreIsMoving) {
				this.rightSide.score.hide();
				this._scoreIsMoving = false;
			}
			
			this._blinkText('skipped');
			this._hideAll(function() {
				this.fire('animationSkipped');
			}.bind(this));
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
					this.tapCatcher.show();
					this._countToZero(turns, score, args.callback);
				}.bind(this)
			});
		},
		
		_countToZero: function(turns, score, callback) {
			this.rightSide.turns.tickingOn();
			
			this.rightSide.turns.transitionTo({
				value: Math.max(turns, 0),
				duration: COUNT_TO_ZERO_TIME * 4 / 5,
				easing: 'ease-out'
			});
		
			this.rightSide.score.transitionTo({
				percent: Math.max(score, 0.999),
				duration: COUNT_TO_ZERO_TIME,
				easing: 'soft-back-ease-out',
				callback: function() {
					this._countToTurns(turns, score, callback);
				}.bind(this)
			});
		},
		
		_countToTurns: function(turns, score, callback) {
			if (turns < 0) {
				this.rightSide.turns.transitionTo({
					value: turns,
					duration: COUNT_TO_TURNS_TIME * 2 / 3,
					easing: 'ease-out'
				});
			
				this.rightSide.score.transitionTo({
					percent: score,
					duration: COUNT_TO_TURNS_TIME,
					easing: 'soft-back-ease-out',
					callback: callback
				});
			} else {
				this._blinkText('completed', LONG_BLINK_TIME);
				callback();
			}
		},
		
		animateMergingScore: function(args) {
			var mergeFrom = this.rightSide.score;
			var mergeWith = args.mergeWith;
			var scaleTo = mergeWith.getRadius() / mergeFrom.getRadius();
			var moveTo = mergeFrom.toLocalOf(mergeWith);
			
			this._scoreIsMoving = true;
			mergeFrom.transitionTo({
				x: moveTo.x,
				y: moveTo.y,
				scale: { x: scaleTo, y: scaleTo }, 
				opacity: MERGE_OPACITY,
				duration: MERGE_MOVE_ANIMATION_TIME,
				easing: 'ease-in-out',
				callback: function() {
					$.delay(MERGE_MOVE_DELAY, function() {
						this._animateScoreComparison(mergeFrom, mergeWith, args.callback);
					}.bind(this));
				}.bind(this)
			});
		},
		
		_animateScoreComparison: function(mergeFrom, mergeWith, callback) {
			var newPercent = mergeFrom.getPercent();
			var lastPercent = mergeWith.getPercent();
			
			if (lastPercent === undefined || newPercent > lastPercent) {
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
				mergeWith.transitionTo({
					percent: mergeFrom.getPercent(),
					duration: SCORE_INCREMENT_TIME,
					easing: 'soft-back-ease-out',
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
				mergeFrom.transitionTo({
					opacity: 0,
					duration: SCORE_FINAL_FADE_OUT_TIME,
					callback: function() {
						this._hideAll(callback);
					}.bind(this)
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
			
			sign.transitionTo({
				opacity: 0,
				duration: SIGN_FADE_OUT_TIME,
				easing: 'ease-in',
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
				scale: circle.getScale(),
				image: img
			});
			
			circle.getParent().add(image);
			
			return image;
		},
		
		_hideAll: function(callback) {
			this._scoreIsMoving = false;
			this.tapCatcher.hide();

			this._hideRightSide(SIDE_ANIMATION_TIME, function() {
				callback();
			});
		}
	});
	
	Kinetic.Global.extend(Class, Kinetic.AbstractSlidingContainer);
	
	return Class;
})();