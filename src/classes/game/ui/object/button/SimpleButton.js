Kinetic.SimpleButton = (function() {
  var Class = $.Class({
    _init_: function(config) {
      Kinetic.Image.call(this, config);
      Kinetic.AbstractButton.call(this, config);

      this.on('click tap', this._onPress);
    },

    _onPress: function() {
      this.attrs.onPress.call(this);
    }
  });

  Kinetic.Util.extend(Class, Kinetic.Image);
  Kinetic.Util.extend(Class, Kinetic.AbstractButton);

  return Class;
})();