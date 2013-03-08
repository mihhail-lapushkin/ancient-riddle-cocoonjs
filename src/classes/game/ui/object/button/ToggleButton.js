Kinetic.ToggleButton = (function() {
	var Class = $.Class({
		_init: function(config) {
			this.setDefaultAttrs({
				enabled: true,
				image: config.images.enabled
			});
			
			config.onPress = this._toggle;
			
			Kinetic.SimpleButton.call(this, config);
		
			this.on('enabledChange', this.refresh);
		},
		
		_toggle: function() {
			var enabled = !this.getEnabled();
			
			this.setEnabled(enabled);
			
			if (enabled) {
				this.attrs.onEnable();
			} else {
				this.attrs.onDisable();
			}
		},
		
		refresh: function() {
			var enabled = this.getEnabled();
			
			this.setImage(this.attrs.images[enabled ? 'enabled' : 'disabled']);
			this.getLayer().draw();
		}
	});
	
	Kinetic.Global.extend(Class, Kinetic.SimpleButton);
	Kinetic.Node.addGettersSetters(Class, [ 'enabled' ]);
	
	return Class;
})();