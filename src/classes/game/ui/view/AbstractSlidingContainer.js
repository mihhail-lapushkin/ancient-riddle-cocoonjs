Kinetic.AbstractSlidingContainer = (function() {
  var OPACITY = 0.75;

  var Class = $.Class({
    _init_: function(config) {
      Kinetic.Group.call(this, config);

      var w = this.getWidth();

      this.add(this.rightSide = new Kinetic.Group({ x: w, visible: false }));
      this.add(this.leftSide = new Kinetic.Group({ x: -w, visible: false }));

      this._buildBGs();
    },

    _buildBGs: function() {
      var w = this.getWidth();
      var h = this.getHeight();

      this.leftSide.add(new Kinetic.Image({
        width: w,
        height: h,
        image: Image.menu.side.left,
        opacity: OPACITY
      }));

      this.rightSide.add(new Kinetic.Image({
        width: w,
        height: h,
        image: Image.menu.side.right,
        opacity: OPACITY
      }));
    },

    _showSide: function(args) {
      args.side.show();
      args.side.to({
        duration: args.duration,
        easing: 'BackEaseOut',
        x: this.getWidth() * args.extend,
        callback: args.callback
      });
    },

    _hideLeftSide: function(duration, callback) {
      this._hideSide({
        side: this.leftSide,
        direction: -1,
        duration: duration,
        callback: callback
      });
    },

    _hideRightSide: function(duration, callback) {
      this._hideSide({
        side: this.rightSide,
        direction: 1,
        duration: duration,
        callback: callback
      });
    },

    _hideSide: function(args) {
      args.side.to({
        duration: args.duration,
        easing: 'BackEaseIn',
        x: args.direction * this.getWidth(),
        callback: function() {
          args.side.hide();
          if (args.callback) args.callback();
        }
      });
    }
  });

  Kinetic.Util.extend(Class, Kinetic.Group);

  return Class;
})();