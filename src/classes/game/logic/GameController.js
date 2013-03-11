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
		UI.continuing.destroy();
		delete UI.continuing;
		
		UI.fading.longFadeOut(function() {
			UI.intro.animateWelcome(function() {
				this.newGame(1, 1, this.showHints.bind(this));
			}.bind(this));
		}.bind(this));
	},
	
	showHints: function() {
		UI.intro.animateHints(function() {
			delete UI.intro;
			this.activateGame();
		}.bind(this));
	},

	continueGame: function() {
		UI.intro.destroy();
		delete UI.intro;
		
		this.initGame();
	
		UI.fading.fastFadeOut(function() {
			UI.continuing.fadeOut(function() {
				delete UI.continuing;
			});
			
			if (DAO.isGameOver()) {
				UI.menu.showMenu({ rightSide: true, hideResume: true });
				UI.inactiveDisp.fadeIn();
			} else {
				UI.game.hud.fadeIn(function() {
					this.activateGame();
				}.bind(this));
			}
		}.bind(this));
	},
	
	newGame: function(d, l, callback) {
		DAO.loadLevel(d, l, function() {
			this.initGame();
			UI.game.fadeIn(function() {
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
			UI.game.listen();
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
		
		if (DAO.isGameOver()) {
			this.ctr('gameOver').gameOver();
		} else {
			var removed = false;
			
			e.neighbours.forEach(function(c) {
				if (c.connections() === 0) {
					c.removeCircle();
					removed = true;
				}
			});
			
			if (removed) {
				this.saveLayout();
			}
			
			UI.layoutManager.adjustLayout();
		}
	},

	disconnectedCircleRemoved: function(e) {
		var pressesLeft = e.circle.getPressCountLeft();
		
		DAO.decreaseTurns(pressesLeft);
		this.saveLayout();	

		UI.game.hud.setTurns({
			value : DAO.getTurns(),
			animate : pressesLeft > 1 ? true : false,
			callback : function() {
				if (DAO.isGameOver()) {
					this.ctr('gameOver').gameOver();
				}
			}.bind(this)
		});

		if (pressesLeft > 1) {
			UI.game.hud.floatNumber({
				position : e.circle.getPosition(),
				number : pressesLeft,
				negative : true
			});
		}
	},

	layoutAdjusted: function() {
		this.saveLayout();
	}
});