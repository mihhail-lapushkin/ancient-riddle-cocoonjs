WelcomeController = $.Class({
	extend: Controller,
	ctrName: 'welcome',
	ctrInit: function() {
		if (UI.welcome) {
			UI.welcome.on('hintScore', this.hintScore.bind(this));
			UI.welcome.on('restoreScore', this.restoreScore.bind(this));
			UI.welcome.on('hintActiveCircle', this.hintActiveCircle.bind(this));
			UI.welcome.on('restoreActiveCircle', this.restoreActiveCircle.bind(this));
			UI.welcome.on('hintPassiveCircle', this.hintPassiveCircle.bind(this));
			UI.welcome.on('restorePassiveCircle', this.restorePassiveCircle.bind(this));
			UI.welcome.on('hintCircle', this.hintCircle.bind(this));
			UI.welcome.on('restoreCircle', this.restoreCircle.bind(this));
		}
	},
	
	_moveToWelcome: function(object) {
		object.moveTo(UI.welcome);
		object.moveDown();
	},
	
	hintScore: function() {
		this._moveToWelcome(this._t = UI.game.hud.turns);
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
			this._moveToWelcome(c);
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
			this._moveToWelcome(c);
		}.bind(this));
	},
	
	restorePassiveCircle: function() {
		this._pc.forEach(function(c) {
			c.moveTo(UI.game.circles);
		});
	},
	
	hintCircle: function() {
		this._moveToWelcome(this._con = UI.game.connections);
		this._moveToWelcome(this._cir = UI.game.circles);
	},
	
	restoreCircle: function() {
		this._con.moveTo(UI.game);
		this._cir.moveTo(UI.game);
	}
});