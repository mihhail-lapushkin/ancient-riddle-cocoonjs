(function() {
	// overwrites
	
	var sp = Kinetic.Stage.prototype;
	
	sp._getContentPosition = function() {
        var rect = this.content.getBoundingClientRect ? this.content.getBoundingClientRect() : { top : 0, left : 0 };
        return { top: rect.top, left: rect.left };
	};
	
	// add-ons
	
	var gp = Kinetic.Group.prototype;
	
	gp.isEmpty = function() {
		return this.getChildren().length === 0;
	};
	
	gp.size = function() {
		return this.getChildren().length;
	};
	
	gp.each = function(fn) {
		this.getChildren().forEach(fn);
	};
	
	gp.centerHorizontally = function(node) {
		node.setX((this.getWidth() - node.getWidth())/2);
	};
		
	gp.centerVertically = function(node) {
		node.setY((this.getHeight() - node.getHeight())/2);
	};
	
	gp.center = function(node) {
		this.centerHorizontally(node);
		this.centerVertically(node);
	};
	
	var s = function() {
		this.setListening(false);
	};
	
	Kinetic.Image.prototype.stopListening = s;
	Kinetic.Shape.prototype.stopListening = s;
	Kinetic.Group.prototype.stopListening = s;
	
	var l = function() {
		this.setListening(true);
	};
	
	Kinetic.Image.prototype.listen = l;
	Kinetic.Shape.prototype.listen = l;
	Kinetic.Group.prototype.listen = l;
	
	var tl = function(n) {
		var nGlobal = n.getAbsolutePosition();
		var tnf = this.getAbsoluteTransform();
		tnf.invert();
		tnf.translate(nGlobal.x, nGlobal.y);
		var tns = tnf.getTranslation();

		return {
			x: this.getX() + tns.x,
			y: this.getY() + tns.y
		};
	};
	
	Kinetic.Image.prototype.toLocalOf = tl;
	Kinetic.Shape.prototype.toLocalOf = tl;
	Kinetic.Group.prototype.toLocalOf = tl;
})();