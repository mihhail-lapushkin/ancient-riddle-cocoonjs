ButtonController = $.Class({
  extend: Controller,
  ctrName: 'button',
  ctrInit: function() {
    Event.backPressed(this.hardwareBackPressed);
    Event.menuPressed(this.hardwareMenuPressed);

    UI.quit.on('quit', this.quit.bind(this));
    UI.game.hud.on('paused', this.paused.bind(this));
    UI.menu.on('soundMuted', this.soundMuted.bind(this));
    UI.menu.on('musicMuted', this.musicMuted.bind(this));
    UI.menu.on('resumed', this.resumed.bind(this));
    UI.menu.on('restart', this.restart.bind(this));
    UI.menu.on('levelSelected', this.levelSelected.bind(this));
    UI.menu.on('nextLevel', this.nextLevel.bind(this));
  },

  hardwareBackPressed: function() {
    if (UI.quit.isVisible()) {
      UI.quit.hide();
    } else {
      UI.quit.show();
    }

    return false;
  },

  hardwareMenuPressed: function() {
    if (UI.game.isListening()) {
      UI.game.hud.tapPause();
    } else {
      UI.menu.tapResume();
    }
  },

  quit: function() {
    Device.quitApp();
  },

  paused: function() {
    UI.inactiveDisp.fadeIn();
    UI.menu.showMenu();
    UI.bg.toGrayscale();
    UI.game.setListening(false);
  },

  resumed: function() {
    UI.inactiveDisp.fadeOut();
    UI.menu.hideMenu(function() {
      UI.game.setListening(true);
    });
    UI.bg.toColor();
  },

  soundMuted: function(cmd) {
    AudioManager.muteSound(cmd.muted);
    DAO.soundMuted(cmd.muted);
  },

  musicMuted: function(cmd) {
    AudioManager.muteMusic(cmd.muted);
    DAO.musicMuted(cmd.muted);
  },

  prepareForNewGame: function(callback) {
    UI.inactiveDisp.fadeOut();
    UI.menu.hideMenu(function() {
      UI.game.fadeOut(callback.bind(this));
    }.bind(this));
  },

  restart: function() {
    this.prepareForNewGame(function() {
      this.ctr('game').newGame(DAO.getDifficulty(), DAO.getLevel());
    });
  },

  levelSelected: function(cmd) {
    this.prepareForNewGame(function() {
      this.ctr('game').newGame(cmd.difficulty, cmd.level);
    });
  },

  nextLevel: function() {
    this.prepareForNewGame(function() {
      var next = DAO.getNextLevel();

      this.ctr('game').newGame(next.difficulty, next.level);
    });
  }
});