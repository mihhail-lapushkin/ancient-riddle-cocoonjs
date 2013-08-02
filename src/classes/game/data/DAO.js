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
    
    isIntroNeeded: function() {
      return this.isFreshDb();
    },

    saveGameLayout: function(layoutSrc) {
      db.data.level.layout = LevelData.makeLayout(layoutSrc);
      
      /*var s = '';
      
      for (var i = 0; i < db.data.level.layout.length; i++) {
        s += Math.floor(db.data.level.layout[i][3][0]) + ',' + Math.floor(db.data.level.layout[i][3][1]) + '\n';
      }
        
      console.log(s);*/

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

    getNextLevel: function() {
      var d = this.getDifficulty();
      var l = this.getLevel();

      do {
        if (++l > Level.MAX) {
          if (++d > Difficulty.HARD) {
            d = Difficulty.EASY;
          }

          l = 1;
        }
      } while (this.isLevelLocked(d, l));

      return {
        difficulty: d,
        level: l
      };
    },
    
    isLevelLocked: function(d, l) {
      return LevelData.isInitiallyLocked(d, l) && (this.getScore(d, l - 1) || 0) < 1;
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