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
        var repScore = {};
        repScore[DAO.getLevel()] = lastScore !== undefined ? lastScore : 0;

        this.afterCountingScore(repScore);
      }.bind(this)
    });
  },

  afterCountingScore: function(repScore) {
    $.delay(1, function() {
      UI.menu.setListening(false);
      UI.menu.showLevelSelector({
        difficulty: DAO.getDifficulty(),
        replacementScore: repScore,
        callback: function() {
          UI.gameOver.animateMergingScore({
            mergeWith: UI.menu.getLevelCircle(DAO.getLevel()),
            callback: this.afterEnded
          });
        }.bind(this)
      });
    }.bind(this));
  }
});