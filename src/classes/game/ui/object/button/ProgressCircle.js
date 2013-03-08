Kinetic.ProgressCircle = (function() {
	var OVERLAY_OPACITY = 0.3;
	var OVERLAY_COLOR = 'black';
	
	var Class = $.Class({
		_init: function(config) {
			this.setDefaultAttrs({
				percent: 0,
				size: 'small'
			});
		
			Kinetic.Group.call(this, config);
			Kinetic.AbstractButton.call(this, config);
		
			var imgs = Image.button.progress[this.attrs.size];
			
			this.add(this.base = this._createImage(imgs.base));
			this.add(this.hand = this._createImage(imgs.hand, true));
			this.add(this.complete = this._createImage(imgs.complete));
			this.add(this.empty = this._createImage(imgs.empty));
			this.add(this.overlay = this._createOverlay());
			
			this.on('percentChange', this._percentChanged);
			this.on('click tap', this._onPress);
			
			this._delegatePress();
		},
		
		clear: function() {
			if (this.transAnim) this.transAnim.stop();
			this.setPercent(0);
			this.empty.show();
		},
		
		nullify: function() {
			if (this.transAnim) this.transAnim.stop();
			this.setPercent(0);
			this.empty.hide();
			this._showTicker();
			
			return this;
		},
		
		_showTicker: function() {
			this.complete.hide();
			this.base.show();
			this.overlay.show();
			this.hand.show();
		},
		
		_delegatePress: function() {
			var onPressChild = function() { this.fire('tap'); }.bind(this);
			
			this.each(function(c) {
				c.on('click tap', onPressChild);
			});
		},
			
		_onPress: function() {
			this.attrs.onPress.call(this);
		},
		
		_percentChanged: function(evt) {
			var p = evt.newVal;
			
			if (p === 1) {
				if (!this.complete.isVisible()) {
					this.complete.show();
					this.base.hide();
					this.overlay.hide();
					this.hand.hide();
				}
			} else {
				if (this.complete.isVisible()) {
					this._showTicker();
				}
			}
			
			this.hand.setRotation(Math.PI * 2 * p);
			
			if (p >= 1) {
				if (this.overlay.isVisible()) {
					this.overlay.hide();
				}
			} else {
				if (!this.overlay.isVisible()) {
					this.overlay.show();
				}
				
				this.overlay.setAngle(Math.PI * 2 * (p <= 0 ? 1 : p));
			}
		},
		
		_createOverlay: function() {
			var r = this.getRadius();
			
			return new Kinetic.Wedge({
				x: r,
				y: r,
				radius: r,
				fill: OVERLAY_COLOR,
				opacity: OVERLAY_OPACITY,
				rotation: -Math.PI * 0.5,
				clockwise: true,
				angle: 0
			});
		},
		
		_createImage: function(img, centerForRotation) {
			var r = this.getRadius();
			var offset = centerForRotation ? r : 0;
			
			return new Kinetic.Image({
				x: offset,
				y: offset,
				width: r * 2,
				height: r * 2,
				image: img,
				offset: {
					x: offset,
					y: offset
				}
			});
		}
	});
	
	Kinetic.Global.extend(Class, Kinetic.Group);
	Kinetic.Global.extend(Class, Kinetic.AbstractButton);
	Kinetic.Node.addGettersSetters(Class, [ 'percent', 'radius', 'size' ]);
	
	return Class;
})();