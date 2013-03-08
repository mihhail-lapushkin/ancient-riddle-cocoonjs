DAO = (function() {
	var db = new PersistedObject('state', { scores: {}, muted: { sound: false, music: false } });

	function doMute(what, flag) {
		if (flag === undefined) {
			return db.data.muted[what];
		} else {
			db.data.muted[what] = flag;
			
			db.persist();
		}
	}
	
	return {
		loadLevel: function(d, l, callback) {
			LevelData.get(d, l, function(levelData) {
				db.data.turns = levelData.solution;
				db.data.level = levelData;
				db.data.level.d = d;
				db.data.level.l = l;
				
				db.persist();
				
				callback();
			});
		},
		
		clearDb: function() {
			db.clear();
		},
		
		isFreshDb: function() {
			return db.data.level === undefined;
		},
		
		saveGameLayout: function(layoutSrc) {
			db.data.level.layout = LevelData.makeLayout(layoutSrc);
			
			db.persist();
		},
		
		isGameOver: function() {
			return db.data.level.layout.isEmpty();
		},
		
		getGameLayout: function() {
			return LevelData.parseLayout(db.data.level.layout);
		},
		
		getScore: function(d, l) {
			var level = db.data.level;
			
			return db.data.scores[LevelData.toCode(d ? d : level.d, l ? l : level.l)];
		},
		
		getSolution: function() {
			return db.data.level.solution;
		},
		
		getLevel: function() {
			return db.data.level.l;
		},
		
		getDifficulty: function() {
			return db.data.level.d;
		},
		
		getTurns: function() {
			return db.data.turns;
		},
	
		decreaseTurns: function(n) {
			db.data.turns -= (n === undefined ? 1 : n);
			
			db.persist();
		},
		
		evalScore: function() {
			var level = db.data.level;
			var score = (db.data.turns + level.solution) / level.solution;
			
			return Math.max(0, Math.min(1, score));
		},
		
		saveScore: function() {
			var level = db.data.level;
			
			db.data.scores[LevelData.toCode(level.d, level.l)] = this.evalScore();
			
			db.persist();
		},
		
		soundMuted: function(muted) {
			return doMute('sound', muted);
		},
		
		musicMuted: function(muted) {
			return doMute('music', muted);
		}
	};
})();