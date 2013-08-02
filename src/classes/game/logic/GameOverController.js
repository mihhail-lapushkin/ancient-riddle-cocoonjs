GameOverController = $.Class({
  extend: Controller,
  ctrName: 'gameOver',
  ctrInit: function() {
    UI.gameOver.on('animationSkipped', this.afterEnded.bind(this));
  },

  gameOver: function() {
    UI.game.setListening(false);

    var lastScore = DAO.getScore();
    var newScore = DAO.evalScore();

    if (lastScore === undefined || newScore > lastScore) {
      DAO.saveScore();
    }

    $.delay(1, function() {
      UI.menu.hideMenu();
      UI.bg.toGrayscale(function() {
        UI.game.fadeOut(function() {
          this.animateGameOver(lastScore, newScore);
        }.bind(this));
      }.bind(this));
    }.bind(this));
  },

  afterEnded: function() {
    UI.menu.hideMenu();
    UI.menu.afterSideAnimated(function() {
      UI.menu.setListening(true);
      UI.menu.showMenu({ rightSide: true, showNext: true });
    });
  },

  animateGameOver: function(lastScore, newScore) {
    UI.inactiveDisp.fadeIn();
    UI.gameOver.animateCountingScore({
      score: newScore,
      turns: DAO.getTurns(),
      solution: DAO.getSolution(),
      callback: function() {
        var next = DAO.getNextLevel();
        var fakeScore = {};
        var fakeLocked = {};
        var unlockedLevel;
        
        fakeScore[DAO.getLevel()] = lastScore !== undefined ? lastScore : 0;
        
        if (LevelData.isInitiallyLocked(next.difficulty, next.level) && (!lastScore || lastScore < 1) && newScore >= 1) {
          fakeLocked[next.level] = true;
          unlockedLevel = next.level;
        }

        this.afterCountingScore(fakeScore, fakeLocked, unlockedLevel);
      }.bind(this)
    });
  },

  afterCountingScore: function(fakeScore, fakeLocked, unlockedLevel) {
    $.delay(1, function() {
      UI.menu.setListening(false);
      UI.menu.showLevelSelector({
        difficulty: DAO.getDifficulty(),
        fakeScore: fakeScore,
        fakeLocked: fakeLocked,
        callback: function() {
          var nextClb = this.afterEnded;
          
          if (unlockedLevel !== undefined) {
            nextClb = function() {
              UI.gameOver.animateUnlocking({
                levelCircle: UI.menu.getLevelCircle(unlockedLevel),
                lockIcon: UI.menu.getLockCircle(unlockedLevel),
                callback: this.afterEnded
              });
            }.bind(this);
          }
          
          UI.gameOver.animateMergingScore({
            mergeWith: UI.menu.getLevelCircle(DAO.getLevel()),
            callback: nextClb
          });
        }.bind(this)
      });
    }.bind(this));
  }
});