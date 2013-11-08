GameController = $.Class({
  extend: Controller,
  ctrName: 'game',
  ctrInit: function() {
    UI.game.circles.on('onePressed', this.circlePressed.bind(this));
    UI.game.circles.on('activePressed', this.activeCirclePressed.bind(this));
    UI.game.circles.on('disconnectedRemoved', this.disconnectedCircleRemoved.bind(this));
    UI.game.circles.on('pressedRemoved', this.pressedCircleRemoved.bind(this));

    UI.layoutManager.onComplete(this.layoutAdjusted.bind(this));
  },

  firstGame: function() {
    UI.fading.longFadeOut(function() {
      UI.intro.animateIntro(this.newGame.bind(this, 1, 1, this.showHints.bind(this), true));
    }.bind(this));
  },

  showHints: function() {
    UI.intro.animateHints(function() {
      delete UI.intro;
      this.activateGame();
    }.bind(this));
  },

  continueGame: function() {
    this.initGame();

    UI.message.setToFadeOut('continuing');
    
    UI.fading.fastFadeOut(function() {
      UI.message.fadeOut();

      if (DAO.isGameOver()) {
        UI.menu.showMenu({ rightSide: true, showNext: true });
        UI.inactiveDisp.fadeIn();
      } else {
        UI.game.hud.fadeIn(this.activateGame.bind(this));
      }
    }.bind(this));
  },

  newGame: function(d, l, callback, isFirst) {
    if (!isFirst) {
      UI.message.delayedFadeIn('levelName', d, l);
    }
    
    DAO.loadLevel(d, l, function() {
      this.initGame();
      
      UI.game.fadeIn(function() {
        UI.message.fadeOut();
        
        if (callback) {
          callback();
        } else {
          this.activateGame();
        }
      }.bind(this));
    }.bind(this));
  },

  initGame: function() {
    UI.game.hud.setTurns({ value: DAO.getTurns() });
    UI.inactiveDisp.setLevel(DAO.getDifficulty(), DAO.getLevel());
    UI.game.initCircles(DAO.getGameLayout());
  },

  activateGame: function() {
    UI.bg.toColor(function() {
      UI.game.setListening(true);
    });
  },

  saveLayout: function() {
    DAO.saveGameLayout(UI.game.circles.getChildren());
  },

  circlePressed: function(c) {
    c.getNeighbours().forEach(function(n) {
      n.toggleActive();
    });

    this.saveLayout();
    DAO.decreaseTurns();

    UI.game.hud.setTurns({
      value: DAO.getTurns()
    });
  },

  activeCirclePressed: function() {
    UI.layoutManager.adjustLayout();
  },

  pressedCircleRemoved: function(e) {
    this.saveLayout();

    var neighbourRemoved = false;

    e.neighbours.forEach(function(c) {
      if (c.connections() === 0) {
        c.removeCircle();
        neighbourRemoved = true;
      }
    });

    if (neighbourRemoved) {
      this.saveLayout();
    }

    UI.layoutManager.adjustLayout();
  },

  disconnectedCircleRemoved: function(e) {
    var pressesLeft = e.pressCountLeft;
    var circlePosition = e.position;

    DAO.decreaseTurns(pressesLeft);
    this.saveLayout();

    UI.game.hud.setTurns({
      value: DAO.getTurns(),
      animate: pressesLeft > 1,
      callback: function() {
        if (DAO.isGameOver()) {
          this.ctr('gameOver').gameOver();
        }
      }.bind(this)
    });

    if (pressesLeft > 1) {
      UI.game.hud.floatTapsLost({
        position: circlePosition,
        number: pressesLeft
      });
    }
  },

  layoutAdjusted: function() {
    this.saveLayout();
  }
});