Kinetic.TextGroup = (function() {
  var Class = $.Class({
    _init_: function(config) {
      config.listening = false;

      Kinetic.Group.call(this, config);
    },

    addText: function(img, opacity) {
      var text;

      this.add(text = new Kinetic.ProportionalImage({
        width: img.width,
        image: img,
        opacity: opacity === undefined ? 0 : opacity
      }));

      this._calcSize(img);
      this._calcPosition();
    },

    _calcSize: function(newText) {
      this._maxText = !this._maxText || newText.width > this._maxText.width ? newText : this._maxText;

      this.each(function(n) {
        n.setWidth(n.getImage().width / this._maxText.width * this.getWidth());
      }.bind(this));
    },

    _calcPosition: function() {
      var nh = 0;

      this.each(function(n) { nh += n.getHeight(); });

      var p = (this.getHeight() - nh) / (this.size() - 1);
      var currY = 0;

      this.each(function(n) {
        n.setY(currY);
        currY += n.getHeight() + p;
        this.centerHorizontally(n);
      }.bind(this));
    }
  });

  Kinetic.Util.extend(Class, Kinetic.Group);

  return Class;
})();