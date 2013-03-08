Kinetic.HUD = (function() {
	var FADE_TIME = 1;
	var TURNS_ANIMATION_TIME = 1;
	var LIMIT_ANIMATION_STEP_TIME = 1;
	var FLOATING_NUMBER_STEP_ANIMATION_TIME = 0.5;
	var OPACITY = 0.6;
	
	var TURNS_HEIGHT = 5;
	var PAUSE_SIZE = 6;
	var FLOATING_NUMBER_HEIGHT = 4;
	
	var Class = $.Class({
		_init: function(config) {
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
				image : Image.button.pause,
				onPress: function() { this.fire('paused'); }.bind(this)
			}));
			
			this.add(this.limit = new Kinetic.ProportionalImage({
				x: this.turns.getSizeWidth() + padding * 2,
				width: w * 0.65,
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
				this.transitionTo({
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
			
			this.limit.transitionTo({
				duration: LIMIT_ANIMATION_STEP_TIME,
				easing: 'back-ease-out',
				y: this.attrs.padding,
				opacity: OPACITY,
				callback: function() {
					$.delay(LIMIT_ANIMATION_STEP_TIME, function() {
						this.limit.transitionTo({
							duration: LIMIT_ANIMATION_STEP_TIME,
							easing: 'back-ease-in',
							opacity: 0,
							callback: function() {
								this.limit.setY(y);
							}.bind(this)
						});
					}.bind(this));
				}.bind(this)
			});
		},
		
		floatNumber: function(args) {
			var c = new Kinetic.Counter({
				x: args.position.x,
				y: args.position.y,
				height: this.attrs.unit * FLOATING_NUMBER_HEIGHT,
				opacity: OPACITY,
				value: (args.negative ? -1 : 1) * args.number,
				animate: false,
				listening: false
			});
			
			c.setOffset(c.getWidth()/2, c.getHeight()/2);
			
			this.add(c);
			
			c.transitionTo({
				duration: FLOATING_NUMBER_STEP_ANIMATION_TIME,
				easing: 'strong-ease-out',
				scale: { x: 1.5, y: 1.5 },
				callback: function() {
					c.transitionTo({
						duration: FLOATING_NUMBER_STEP_ANIMATION_TIME,
						easing: 'ease-in',
						opacity: 0,
						scale: { x: 0.5, y: 0.5 },
						callback: function() {
							c.destroy();
						}
					});
				}
			});
		},
		
		fadeIn: function(callback) {
			this.transitionTo({
				opacity: 1,
				duration: FADE_TIME,
				easing: 'ease-out',
				callback: callback
			});
		}
	});
	
	Kinetic.Global.extend(Class, Kinetic.Group);
	Kinetic.Node.addGettersSetters(Class, [ 'turnsVal' ]);
	
	return Class;
})();