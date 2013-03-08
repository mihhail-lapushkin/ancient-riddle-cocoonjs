PersistedObject = $.Class({
	_init: function(name, defVals) {
		defVals = defVals || {};
			
		var obj = localStorage.getItem(name);

		this.data = obj ? JSON.parse(obj) : defVals;
		this._name = name;
		this._defVals = defVals;
			
		this.persist();
	},
	
	persist: function() {
		localStorage.setItem(this._name, JSON.make(this.data));
	},

	clear: function() {
		this.data = this._defVals;
		this.persist();
	}
});