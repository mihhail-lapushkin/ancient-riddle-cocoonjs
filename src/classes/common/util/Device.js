Device = (function() {
	var DEFAULT_VIBRATION_TIME = 20;

	return {
		cancelVibration: function() {
			if (navigator.vibrate) {
				navigator.vibrate(0);
			}
		},
		
		vibrate: function() {
			if (navigator.vibrate) {
				this.cancelVibration();
				
				var args = arguments;
				var val = args;
				
				switch (args.length) {
					case 0:
						val = DEFAULT_VIBRATION_TIME;
						break;
					case 1:
						val = args[0];
						break;
				}
				
				navigator.vibrate(val);
			}
		},
		
		quitApp: function() {
			if (Env.isCocoonJS) {
				Env.callAPI('forceToFinish');
			} else {
				window.close();
			}
		}
	};
})();