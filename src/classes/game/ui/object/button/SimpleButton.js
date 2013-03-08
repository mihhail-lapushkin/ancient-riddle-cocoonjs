Kinetic.SimpleButton = (function() {	
	var Class = $.Class({
		_init: function(config) {
			Kinetic.Image.call(this, config);
			Kinetic.AbstractButton.call(this, config);
			
			this.on('click tap', this._onPress);
		},
		
		_onPress: function() {
			this.attrs.onPress.call(this);
		}
	});
	
	Kinetic.Global.extend(Class, Kinetic.Image);
	Kinetic.Global.extend(Class, Kinetic.AbstractButton);
	
	return Class;
})();