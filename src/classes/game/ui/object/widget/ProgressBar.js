Kinetic.ProgressBar = (function() {
  var DOTS = 15;
  var FADE_DISTANCE = 0.3;

  var Class = $.Class({
    _init_: function(config) {
      Kinetic.Group.call(this, config);

      this._build();
      this.on('percentChange', this._percentChanged);
    },

    _build: function() {
      var w = this.getWidth();
      var h = this.getHeight();
      var gap = (w - h * DOTS) / (DOTS - 1);

      for (var i = 0; i < DOTS; i++) {
        this.add(new Kinetic.ProportionalImage({
          x: i * (h + gap),
          height: h,
          image: Image.text.dot,
          opacity: 0
        }));
      }
    },

    _percentChanged: function(evt) {
      evt.cancelBubble = true;

      var w = this.getWidth();
      var fadeDist = FADE_DISTANCE * w;
      var isRev = this.getReversed();
      var pos = Math.abs(evt.newVal - (isRev ? 1 : 0)) * (w + fadeDist) - fadeDist;

      this.each(function(n) {
        var npos = n.getX() + n.getWidth() / 2;

        if (isRev) {
          n.setOpacity(pos > npos ? 0 : Math.min(npos - pos, fadeDist) / fadeDist);
        } else {
          n.setOpacity(1 - (pos > npos ? 0 : Math.min(npos - pos, fadeDist) / fadeDist));
        }
      });

      this.getLayer().draw();
    }
  });

  Kinetic.Util.extend(Class, Kinetic.Group);
  Kinetic.Factory.addGetterSetter(Class, 'percent', 0);
  Kinetic.Factory.addGetterSetter(Class, 'reversed', false);

  return Class;
})();