InitController = $.Class({
	extend: Controller,
	ctrName: 'init',
	ctrInit: function() {
		this.initUI();
		this.initSound();
		this.initMenuState();
		this.launch();
	},
	
	initUI: function() {
		UI.build();
	},
	
	initSound: function() {
		SoundManager.muteSound(DAO.soundMuted());
		SoundManager.muteMusic(DAO.musicMuted());
		SoundManager.startMusic({ shuffle: !DAO.isFreshDb() });
	},
	
	initMenuState: function() {
		UI.menu.soundMuted(DAO.soundMuted());
		UI.menu.musicMuted(DAO.musicMuted());
		UI.menu.scoreCallback(function(d, l) {
			return DAO.getScore(d, l);
		});
	},
	
	launch: function() {
		if (DAO.isFreshDb()) {
			this.ctr('game').firstGame();
		} else {
			this.ctr('game').continueGame();
		}
	}
});