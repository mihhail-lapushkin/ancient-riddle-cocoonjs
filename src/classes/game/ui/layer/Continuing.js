Kinetic.Continuing = (function() {
	var TEXT_WIDTH = 0.8;
	var TEXT_OPACITY = 0.8;
	var ANIMATION_TIME = 0.8;
	
	var Class = $.Class({
		_init: function(config) {
			config.listening = false;
			
			Kinetic.Group.call(this, config);
			
			this._build();
		},
		
		_build: function() {
			var w = this.getWidth();
			var h = this.getHeight();
			
			this.add(this.text = new Kinetic.ProportionalImage({
				width: w * TEXT_WIDTH,
				opacity: TEXT_OPACITY,
				image: Image.text.continuing
			}));
			
			this.center(this.text);
		},
			
		fadeOut: function(callback) {
			this.text.transitionTo({
				duration: ANIMATION_TIME,
				opacity: 0,
				callback: function() {
					this.destroy();
					if (callback) callback();
				}.bind(this)
			});
		},
		
		destroy: function() {
			Kinetic.Group.prototype.destroy.call(this);
			delete Image.text.continuing;
		}
	});
	
	Kinetic.Global.extend(Class, Kinetic.Group);
	
	return Class;
})();