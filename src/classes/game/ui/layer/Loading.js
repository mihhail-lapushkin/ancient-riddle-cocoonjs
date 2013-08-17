Kinetic.Loading = (function() {
  var TEXT_HEIGHT = 6;
  var BAR_Y = 0.8;
  var BAR_WIDTH = 0.7;
  var BAR_HEIGHT = 2.2;

  var Class = $.Class({
    _init_: function(config) {
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

      this.add(this.bar = new Kinetic.ProgressBar({
        y: h * BAR_Y,
        width: w * BAR_WIDTH,
        height: unit * BAR_HEIGHT,
        reversed: true
      }));

      this.center(this.text);
      this.centerHorizontally(this.bar);
    },

    _percentChanged: function(evt) {
      this.text.setOpacity(1 - evt.newVal);
      this.bar.setPercent(1 - evt.newVal);
      this.getParent().draw();
    },

    destroy: function() {
      Kinetic.Group.prototype.destroy.call(this);
      delete Image.text.loading;
    }
  });

  Kinetic.Util.extend(Class, Kinetic.Group);
  Kinetic.Factory.addGetterSetter(Class, 'percent');

  return Class;
})();