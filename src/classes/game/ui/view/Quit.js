Kinetic.Quit = (function() {
  var BG_OPACITY = 0.4;
  var MESSAGE_HEIGHT = 0.3;
  var BUTTON_SIZE = 0.5;

  var Class = $.Class({
    _init_: function(config) {
      config.visible = false;

      Kinetic.Group.call(this, config);

      this._build();
      this.on('visibleChange', function() { this.getLayer().draw(); });
    },

    _build: function() {
      var padding = this.attrs.padding * 2;
      var w = this.getWidth();
      var h = this.getHeight();
      var buttonSize = h * BUTTON_SIZE;

      this.add(this.bg = new Kinetic.Rect({
        width: w,
        height: h,
        fill: 'black',
        opacity: BG_OPACITY
      }));

      this.add(this.message = new Kinetic.ProportionalImage({
        y: padding,
        height: h * MESSAGE_HEIGHT,
        image: Image.text.quit
      }));

      this.message.setX((w - this.message.getWidth()) / 2);

      this.add(this.no = new Kinetic.SimpleButton({
        x: padding,
        y: h - padding - buttonSize,
        width: buttonSize,
        height: buttonSize,
        image: Image.button.quit.no,
        onPress: this.hide.bind(this)
      }));

      this.add(this.yes = new Kinetic.SimpleButton({
        x: w - padding - buttonSize,
        y: h - padding - buttonSize,
        width: buttonSize,
        height: buttonSize,
        image: Image.button.quit.yes,
        onPress: this.fire.bind(this, 'quit')
      }));
    }
  });

  Kinetic.Util.extend(Class, Kinetic.Group);

  return Class;
})();