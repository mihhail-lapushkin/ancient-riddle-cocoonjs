Kinetic.Fading = (function() {
	var LONG_TIME = 5;
	var FAST_TIME = 1;
	
	var Class = $.Class({
		_init: function(config) {
			config.fill = 'black';
			config.listening = false;
			
			Kinetic.Rect.call(this, config);
		},
		
		fadeOut: function(dur, callback) {
			this.transitionTo({
				opacity: 0,
				easing: 'ease-in',
				duration: dur,
				callback: function() {
					this.destroy();
					if (callback) callback();
				}.bind(this)
			});
		},
		
		longFadeOut: function(callback) {
			this.fadeOut(LONG_TIME, callback);
		},
		
		fastFadeOut: function(callback) {
			this.fadeOut(FAST_TIME, callback);
		}
	});
	
	Kinetic.Global.extend(Class, Kinetic.Rect);
	
	return Class;
})();