LevelData = (function() {
	var X		= 0;
	var Y		= 1;
	var ID		= 0;
	var ACTIVE	= 1;
	var SCORE	= 2;
	var POS		= 3;
	var CONNS	= 4;
	
	var LEVEL_PATH = 'resources/lvl/{0}/{1}';
	
	var width = 0, height = 0;
	
	return {
		setLevelDimensions: function(w, h) {
			width = w;
			height = h;
		},
		
		makeLayout: function(circles) {
			var layout = [];
			
			circles.forEach(function(circle) {
				var c = {};
				
				c[ID] = circle.getId();
				c[ACTIVE] = circle.isActive() ? 1 : 0;
				c[SCORE] = circle.getScore();
				c[POS] = {};
				c[POS][X] = circle.getX() / width * 100;
				c[POS][Y] = circle.getY() / height * 100;
				c[CONNS] = [];
				
				circle.getOwnNeighbours().forEach(function(neig) {
					c[CONNS].add(neig.getId());
				});
				
				layout.add(c);
			});
			
			return layout;
		},
		
		parseLayout: function(layout) {
			var circles = [];
			
			layout.forEach(function(c) {
				circles.add({
					id: c[ID],
					x: c[POS][X] / 100 * width,
					y: c[POS][Y] / 100 * height,
					active: c[ACTIVE] === 1,
					score: c[SCORE],
					connections: c[CONNS]
				});
			});
			
			return circles;
		},
		
		get: function(d, l, callback) {
			JSON.load(LEVEL_PATH.format(d, l), callback);
		},
		
		toCode: function(difficulty, level) {
			return parseInt(difficulty, 10) * 100 + parseInt(level, 10);
		}
	};
})();