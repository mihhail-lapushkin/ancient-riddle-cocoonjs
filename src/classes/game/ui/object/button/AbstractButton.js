Kinetic.AbstractButton = (function() {
  var PRESS_DELAY = 0.5;

  var Class = $.Class({
    _init_: function() {
      this.on('click tap', this._onPressAbstract);
    },

    _onPressAbstract: function(evt) {
      evt.cancelBubble = true;

      this._delayListening();
      this._playPressSound();
    },

    _delayListening: function() {
      this.setListening(false);
      $.delay(PRESS_DELAY, function() {
        this.setListening(true);
        this.getLayer().drawHit();
      }.bind(this));
    },

    _playPressSound: function() {
      AudioManager.play(Audio.sound.tap.button);
    }
  });

  return Class;
})();