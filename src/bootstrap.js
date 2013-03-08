(function() {
	if (Env.isDev && Dev.FLUSH_DB) {
		DAO.clearDb();
	}
	
	ImageLoader.isXDPI(function() {
		var w = window.innerWidth;
		var h = window.innerHeight;
		
		if (Env.isDev) {
			w = Dev.WIDTH;
			h = Dev.HEIGHT;
		}
		
		return w > DPI.H.width && h > DPI.H.height;
	});
	
	var splashLoader = new ImageLoader('resources/img', {
		png: {
			text: [ 'loading' ]
		}
	});
	
	var imageLoader = new ImageLoader('resources/img', {
		png: {
			digit:	{
				pos:	[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
				neg:	[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
				big:	[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
				_:		[ 'separator' ]
			},
			
			text:	{
				welcome:	[	'title',
								'goodLuck',
								'quickHints',
								'aCircleHint1', 'aCircleHint2',
								'circleHint1', 'circleHint2', 'circleHint3', 'circleHint4',
								'greetings1', 'greetings2', 'greetings3', 'greetings4',
								'pCircleHint1', 'pCircleHint2', 'pCircleHint3',
								'scoreHint1', 'scoreHint2' ],
				_:			[ 'continuing', 'difficulty', 'level', 'score', 'quit', 'limit', 'skipped', 'highScore', 'worseScore', 'sameScore', 'completed' ]
			},
			
			icon:	[ 'empty', 'plus', 'minus', 'equal' ],
			
			circle: {
				active:		[ 1, 2, 3, 4, 5 ],
				passive:	[ 1, 2, 3, 4, 5 ],
				connection: [ 'marker' ]
			},
			
			menu: {
				side:		[ 'left', 'right' ]
			},
			
			button: {
				progress: {
					small: [ 'base', 'hand', 'complete', 'empty' ],
					large: [ 'base', 'hand', 'complete', 'empty' ]
				},
				difficulty: [ 'easy', 'normal', 'hard', 'choose' ],
				music:		[ 'on', 'off' ],
				sound:		[ 'on', 'off' ],
				quit:		[ 'yes', 'no' ],
				_:			[ 'pause', 'restart', 'resume' ]
			},
			
			bg: [ 'trans' ]
		},
		jpg: {
			bg: [ 'normal', 'gs' ]
		}
	});
	
	var audioLoader = new AudioLoader('resources/aud', {
		sound: {
			tap:	[ 'circle', 'button' ],
			_:		[ 'tick' ]
		},
		music: [ 1, 2, 3, 4, 5 ]
	});
	
	imageLoader.progress(UI.trackLoading);
	
	Event.allFired({
		events: [ Event.pageLoaded, splashLoader.loaded ],
		callback: UI.showLoading
	});
	
	Event.allFired({
		events: [ Event.pageLoaded, imageLoader.loaded, audioLoader.loaded ],
		callback: Controller.initAll
	});
})();