Kinetic.DoubleCounter = (function() {
  var SEPARATOR_HEIGHT = 0.7;

  var Class = $.Class({
    _init_: function(config) {
      Kinetic.Group.call(this, config);

      this._digit = Image.digit.big;
      this._build();

      this.on('valueOneChange', this._valueOneChanged);
      this.on('valueTwoChange', this._valueTwoChanged);

      this._updateHorLocation();
    },

    _build: function() {
      var h = this.getHeight();

      this.add(this.counter1 = new Kinetic.ProportionalImage({
        height: h,
        image: this._digit[0]
      }));

      this.add(this.separator = new Kinetic.ProportionalImage({
        y: h * (1 - SEPARATOR_HEIGHT) / 2,
        height: h * SEPARATOR_HEIGHT,
        size: 1,
        image: Image.digit.separator
      }));

      this.add(this.counter2 = new Kinetic.ProportionalImage({
        height: h,
        image: this._digit[0]
      }));
    },

    _updateHorLocation: function() {
      var p = this.getPadding();

      this.separator.setX(this.counter1.getWidth() + p);
      this.counter2.setX(this.separator.getX() + this.separator.getWidth() + p);
    },

    _valueOneChanged: function(evt) {
      this.counter1.setImage(this._digit[evt.newVal]);
      this.counter1.refreshWidth();
      this._updateHorLocation();
    },

    _valueTwoChanged: function(evt) {
      this.counter2.setImage(this._digit[evt.newVal]);
      this.counter2.refreshWidth();
    }
  });

  Kinetic.Util.extend(Class, Kinetic.Group);
  Kinetic.Factory.addGetterSetter(Class, 'valueOne');
  Kinetic.Factory.addGetterSetter(Class, 'valueTwo');
  Kinetic.Factory.addGetterSetter(Class, 'padding');

  return Class;
})();