Kinetic.PressCatcher = (function() {
  var Class = $.Class({
    _init_: function(config) {
      config.image = Image.bg.trans;

      Kinetic.Rect.call(this, config);

      this.on('tap click', config.onPress);
    }
  });

  Kinetic.Util.extend(Class, Kinetic.Rect);

  return Class;
})();