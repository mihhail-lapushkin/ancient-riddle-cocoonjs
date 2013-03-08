Kinetic.Loading = (function() {
	var TEXT_HEIGHT = 6;
	
	var Class = $.Class({
		_init: function(config) {
			config.listening = false;
			
			Kinetic.Group.call(this, config);
			
			this._build();
			this.on('percentChange', this._percentChanged);
		},
		
		_build: function() {
			var w = this.getWidth();
			var h = this.getHeight();
			var unit = this.attrs.unit;
			
			this.add(this.bg = new Kinetic.Rect({
				width: w,
				height: h,
				fill: 'black'
			}));
			
			this.add(this.text = new Kinetic.ProportionalImage({
				height: unit * TEXT_HEIGHT,
				image: Image.text.loading
			}));
			
			this.center(this.text);
		},
		
		_percentChanged: function(evt) {
			this.text.setOpacity(1 - evt.newVal);
			this.getParent().draw();
		},
		
		destroy: function() {
			Kinetic.Group.prototype.destroy.call(this);
			delete Image.text.loading;
		}
	});
	
	Kinetic.Global.extend(Class, Kinetic.Group);
	Kinetic.Node.addGettersSetters(Class, [ 'percent' ]);
	
	return Class;
})();