Kinetic.ProportionalImage = (function() {
  var Class = $.Class({
    _init_: function(config) {
      Kinetic.Image.call(this, config);

      this.on('widthChange', this._syncHeight);
      this.on('heightChange', this._syncWidth);

      if (config.width !== undefined) {
        this.setWidth(config.width);
      } else if (config.height !== undefined) {
        this.setHeight(config.height);
      }
    },

    _syncDim: function(from, to, evt) {
      var img = this.getImage();

      this.attrs[to] = img[to] * evt.newVal / img[from];
    },

    _syncWidth: function(evt) {
      this._syncDim('height', 'width', evt);
    },

    _syncHeight: function(evt) {
      this._syncDim('width', 'height', evt);
    },

    refreshWidth: function() {
      this._syncWidth({ newVal: this.getHeight() });
    },

    refreshHeight: function() {
      this._syncHeight({ newVal: this.getWidth() });
    }
  });

  Kinetic.Util.extend(Class, Kinetic.Image);

  return Class;
})();