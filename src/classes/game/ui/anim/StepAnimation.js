Kinetic.StepAnimation = (function() {
  var Class = $.Class({
    _init_: function(config) {
      this.onStep(config.onStep);
      this.onComplete(config.onComplete);

      Kinetic.Animation.call(this, this._animFunc.bind(this), config.redrawNode);
    },

    _animFunc: function() {
      this.currentStep++;

      this._onStep();

      if (this.currentStep == this.finalStep) {
        this.stop();
        this._onComplete();
      }
    },

    onStep: function(fn) {
      this._onStep = fn;
    },

    onComplete: function(fn) {
      this._onComplete = fn;
    },

    run: function(steps) {
      this.currentStep = 0;
      this.finalStep = steps;

      this.start();
    }
  });

  Kinetic.Util.extend(Class, Kinetic.Animation);

  return Class;
})();