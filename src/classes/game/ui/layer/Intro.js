Kinetic.Intro = (function() {
	var TITLE_HEIGHT = 23;
	var GOOD_LUCK_HEIGHT = 7;
	var QUICK_HINTS_HEIGHT = 6;
	var TITLE_ANIMATION_TIME = 5;
	var DARK_OVERLAY_ANIMATION_TIME = 1.5;
	var DARK_OVERLAY_OPAICTY = 0.65;
	var FADE_TIME = 1.8;
	var HINT_DELAY = 1;
	
	var Class = $.Class({
		_init: function(config) {
			config.listening = false;
			
			Kinetic.Group.call(this, config);
			
			this._build();
		},
		
		_build: function() {
			var w = this.getWidth();
			var h = this.getHeight();
			
			this.add(this.darkOverlay = new Kinetic.Rect({
				width: w,
				height: h,
				fill: 'black',
				opacity: 0
			}));
			
			this._createCenteredText('title', TITLE_HEIGHT, 1);
			this._createCenteredText('goodLuck', GOOD_LUCK_HEIGHT);
			this._createCenteredText('quickHints', QUICK_HINTS_HEIGHT);
			
			this._createTextGroup({ name: 'greetings', w: 0.8, h: 0.7, center: true });
			this._createTextGroup({ name: 'scoreHint', w: 0.75, h: 0.22, x: 0.125, y: 0.24 });
			this._createTextGroup({ name: 'aCircleHint', w: 0.8, h: 0.2, x: 0.1, y: 0.5 });
			this._createTextGroup({ name: 'pCircleHint', w: 0.8, h: 0.33, x: 0.1, y: 0.2 });
			this._createTextGroup({ name: 'circleHint', w: 0.7, h: 0.6, center: true });
		},
		
		_createCenteredText: function(name, size, opacity) {
			var unit = this.attrs.unit;
			
			this.add(this[name] = new Kinetic.ProportionalImage({
				height: unit * size,
				image: Image.text.intro[name],
				opacity: opacity === undefined ? 0 : 1
			}));

			this.center(this[name]);
		},
		
		_createTextGroup: function(conf) {
			var w = this.getWidth();
			var h = this.getHeight();
	
			this.add(this[conf.name] = new Kinetic.TextGroup({ width: w * conf.w, height: h * conf.h }));
			
			/*jshint boss:true */
			for (var i = 1, img; img = Image.text.intro[conf.name + i]; i++) {
				this[conf.name].addText(img);
			}

			if (conf.center) {
				this.center(this[conf.name]);
			} else {
				this[conf.name].setPosition(conf.x * w, conf.y * h);
			}
		},
		
		_fadeIn: function(n, callback) {
			n.transitionTo({
				duration: FADE_TIME,
				opacity: 1,
				callback: callback
			});
		},
		
		_fadeOut: function(n, callback) {
			n.transitionTo({
				duration: FADE_TIME,
				opacity: 0,
				callback: callback
			});
		},
		
		_fadeInOut: function(n, callback) {
			this._fadeIn(n, function() {
				this._fadeOut(n, callback.bind(this));
			}.bind(this));
		},

		_fadeInOutGroupNodes: function(g, callback) {
			var nodes = g.getChildren();
			var fadeOutAfter = Math.ceil(g.size() / 2);
			var i = 0, j = 0;
			
			var fadeInNode = function() {
				if (i === g.size()) {
					return;
				}
				
				if (i === fadeOutAfter) {
					fadeOutNode();
				}
				
				this._fadeIn(nodes[i++], fadeInNode);
			}.bind(this);
			
			var fadeOutNode = function() {
				if (j === g.size()) {
					callback();
				} else {
					this._fadeOut(nodes[j++], fadeOutNode);
				}
			}.bind(this);
			
			fadeInNode();
		},
		
		_animateHint: function(conf) {
			this.fire(conf.hintEvt);
			this.getLayer().draw();
			$.delay(HINT_DELAY, function() {
				var clb;
			
				if (conf.restoreEvt) {
					clb = function() {
						this.fire(conf.restoreEvt);
						this.getLayer().draw();
						$.delay(HINT_DELAY, conf.callback.bind(this));
					}.bind(this);
				} else {
					clb = conf.callback.bind(this);
				}
			
				this._fadeInOutGroupNodes(this[conf.group], clb);
			}.bind(this));
		},
		
		_beforeAnimateHints: function(callback) {
			this.darkOverlay.transitionTo({
				duration: DARK_OVERLAY_ANIMATION_TIME,
				opacity: DARK_OVERLAY_OPAICTY,
				callback: function() {
					this._fadeInOut(this.quickHints, function() {
						$.delay(HINT_DELAY, callback.bind(this));
					});
				}.bind(this)
			});
		},
		
		_afterAnimateHints: function(callback) {
			this.darkOverlay.transitionTo({
				duration: DARK_OVERLAY_ANIMATION_TIME,
				opacity: 0,
				callback: function() {
					this.fire('restoreCircle');
					this._fadeInOut(this.goodLuck, callback);
				}.bind(this)
			});
		},
		
		animateHints: function(callback) {
			this._beforeAnimateHints(function() {
				this._animateHint({
					hintEvt: 'hintScore',
					restoreEvt: 'restoreScore',
					group: 'scoreHint',
					callback: function() {
						this._animateHint({
							hintEvt: 'hintActiveCircle',
							restoreEvt: 'restoreActiveCircle',
							group: 'aCircleHint',
							callback: function() {
								this._animateHint({
									hintEvt: 'hintPassiveCircle',
									restoreEvt: 'restorePassiveCircle',
									group: 'pCircleHint', 
									callback: function() {
										this._animateHint({
											hintEvt: 'hintCircle',
											group: 'circleHint',
											callback: function() {
												this._afterAnimateHints(function() {
													this.destroy();
													if (callback) callback();
												});
											}
										});
									}
								});
							}
						});
					}
				});
			});
		},
		
		animateIntro: function(callback) {
			this.title.transitionTo({
				duration: TITLE_ANIMATION_TIME,
				opacity: 0,
				callback: function() {
					this._fadeInOutGroupNodes(this.greetings, function() {
						if (callback) callback();
					});
				}.bind(this)
			});
		},
		
		destroy: function() {
			Kinetic.Group.prototype.destroy.call(this);
			delete Image.text.intro;
		}
	});
	
	Kinetic.Global.extend(Class, Kinetic.Group);
	
	return Class;
})();