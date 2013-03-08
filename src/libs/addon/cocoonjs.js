if (navigator.isCocoonJS) {
	var FLICKERING_DEVICES = /(GT-I9000)/i;
	
	console.log('User Agent: ' + navigator.userAgent);
	console.log('Platform: ' + navigator.platform);
	console.log('Vendor: ' + navigator.vendor);
	console.log('App Version: ' + navigator.appVersion);
	console.log('Browser: ' + navigator.browser);
	
	if (!FLICKERING_DEVICES.test(navigator.platform)) {
		console.log('Using screencanvas');
		
		document._createElement = document.createElement;
		var firstCanvas = true;
	
		document.createElement = function(el) {
			if (el === 'canvas' && firstCanvas) {
				firstCanvas = false;
				return this._createElement('screencanvas');
			}
	
			return this._createElement(el);
		};
	}
}