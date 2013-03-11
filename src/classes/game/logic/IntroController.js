IntroController = $.Class({
	extend: Controller,
	ctrName: 'intro',
	ctrInit: function() {
		if (UI.intro) {
			UI.intro.on('hintScore', this.hintScore.bind(this));
			UI.intro.on('restoreScore', this.restoreScore.bind(this));
			UI.intro.on('hintActiveCircle', this.hintActiveCircle.bind(this));
			UI.intro.on('restoreActiveCircle', this.restoreActiveCircle.bind(this));
			UI.intro.on('hintPassiveCircle', this.hintPassiveCircle.bind(this));
			UI.intro.on('restorePassiveCircle', this.restorePassiveCircle.bind(this));
			UI.intro.on('hintCircle', this.hintCircle.bind(this));
			UI.intro.on('restoreCircle', this.restoreCircle.bind(this));
		}
	},
	
	_moveToIntro: function(object) {
		object.moveTo(UI.intro);
		object.moveDown();
	},
	
	hintScore: function() {
		this._moveToIntro(this._t = UI.game.hud.turns);
		this._to = this._t.getOpacity();
		this._t.setOpacity(1);
	},
	
	restoreScore: function() {
		this._t.moveTo(UI.game.hud);
		this._t.setOpacity(this._to);
	},
	
	hintActiveCircle: function() {		
		this._ac = [];
		
		UI.game.circles.each(function(c) {
			if (c.isActive()) {
				this._ac.add(c);
			}
		}.bind(this));
		
		this._ac.forEach(function(c) {
			this._moveToIntro(c);
		}.bind(this));
	},
	
	restoreActiveCircle: function() {
		this._ac.forEach(function(c) {
			c.moveTo(UI.game.circles);
		});
	},
	
	hintPassiveCircle: function() {
		this._pc = [];
		
		UI.game.circles.each(function(c) {
			if (!c.isActive()) {
				this._pc.add(c);
			}
		}.bind(this));
		
		this._pc.forEach(function(c) {
			this._moveToIntro(c);
		}.bind(this));
	},
	
	restorePassiveCircle: function() {
		this._pc.forEach(function(c) {
			c.moveTo(UI.game.circles);
		});
	},
	
	hintCircle: function() {
		this._moveToIntro(this._con = UI.game.connections);
		this._moveToIntro(this._cir = UI.game.circles);
	},
	
	restoreCircle: function() {
		this._con.moveTo(UI.game);
		this._cir.moveTo(UI.game);
	}
});