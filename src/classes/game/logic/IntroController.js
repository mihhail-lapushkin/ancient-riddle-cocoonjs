IntroController = $.Class({
  extend: Controller,
  ctrName: 'intro',
  ctrInit: function() {
    if (UI.intro) {
      UI.intro.on('hintScore', this.hintScore.bind(this));
      UI.intro.on('hintActiveCircle', this.hintActiveCircle.bind(this));
      UI.intro.on('hintPassiveCircle', this.hintPassiveCircle.bind(this));
      UI.intro.on('hintCircle', this.hintCircle.bind(this));
    }
  },

  hintScore: function() {
    var turns = UI.game.hud.turns.clone();
    turns.setOpacity(1);
    UI.intro.addObject(turns);
  },

  hintActiveCircle: function() {
    UI.game.circles.each(function(c) {
      if (c.isActive()) UI.intro.addObject(c.clone());
    });
  },

  hintPassiveCircle: function() {
    UI.game.circles.each(function(c) {
      if (!c.isActive()) UI.intro.addObject(c.clone());
    });
  },

  hintCircle: function() {
    UI.intro.addObject(UI.game.circles.clone());
  }
});