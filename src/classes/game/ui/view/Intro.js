Kinetic.Intro = (function() {
  var TITLE_HEIGHT = 23;
  var GOOD_LUCK_HEIGHT = 7;
  var QUICK_HINTS_HEIGHT = 6;
  var TITLE_ANIMATION_TIME = 4;
  var DARK_OVERLAY_ANIMATION_TIME = 1.2;
  var DARK_OVERLAY_OPAICTY = 0.65;
  var FADE_TIME = 1.8;
  var HINT_DELAY = 0.5;
  var SKIP_CALLBACK_DELAY = 0.3;

  var Class = $.Class({
    _init_: function(config) {
      Kinetic.Group.call(this, config);

      this._build();
    },

    _build: function() {
      var w = this.getWidth();
      var h = this.getHeight();

      this.add(this.darkOverlay = new Kinetic.Rect({ width: w, height: h, fill: 'black', opacity: 0 }));
      this.add(this.objects = new Kinetic.Group({ width: w, height: h, listening: false, opacity: 0 }));
      this.add(this.texts = new Kinetic.Group({ width: w, height: h, listening: false }));
      this.add(this.pressCatcher = new Kinetic.PressCatcher({ width: w, height: h, onPress: this._skip.bind(this) }));

      this._createCenteredText({ name: 'title', size: TITLE_HEIGHT, opacity: 1 });
      this._createCenteredText({ name: 'goodLuck', size: GOOD_LUCK_HEIGHT });
      this._createCenteredText({ name: 'quickHints', size: QUICK_HINTS_HEIGHT });

      this._createTextGroup({ name: 'scoreHint', w: 0.75, h: 0.22, x: 0.125, y: 0.24 });
      this._createTextGroup({ name: 'aCircleHint', w: 0.8, h: 0.2, x: 0.1, y: 0.5 });
      this._createTextGroup({ name: 'pCircleHint', w: 0.8, h: 0.33, x: 0.1, y: 0.2 });
      this._createTextGroup({ name: 'circleHint', w: 0.7, h: 0.6, center: true });
      this._createTextGroup({ name: 'bigCircleHint', w: 0.7, h: 0.6, center: true });
    },

    addObject: function(obj) {
      this.objects.add(obj);
    },

    _destroyObjects: function() {
      while (!this.objects.children.isEmpty()) this.objects.children[0].destroy();
    },

    _skip: function() {
      if (this.introCallback) this._finishAnimatingIntro(true);
      if (this.hintsCallback) this._destroyAndExit(true);
    },

    _createCenteredText: function(conf) {
      var unit = this.attrs.unit;

      this.texts.add(this.texts[conf.name] = new Kinetic.ProportionalImage({
        name: conf.name,
        height: unit * conf.size,
        image: Image.text.intro[conf.name],
        opacity: conf.opacity ? conf.opacity : 0
      }));

      this.texts.center(this.texts[conf.name]);
    },

    _createTextGroup: function(conf) {
      var w = this.getWidth();
      var h = this.getHeight();

      this.texts.add(this.texts[conf.name] = new Kinetic.TextGroup({
        width: w * conf.w,
        height: h * conf.h
      }));

      /*jshint boss:true */
      for (var i = 1, img; img = Image.text.intro[conf.name + i]; i++) {
        this.texts[conf.name].addText(img);
      }

      if (conf.center) {
        this.texts.center(this.texts[conf.name]);
      } else {
        this.texts[conf.name].setPosition(conf.x * w, conf.y * h);
      }
    },

    _fadeIn: function(n, callback) {
      n.to({
        duration: FADE_TIME,
        opacity: 1,
        callback: callback
      });
    },

    _fadeOut: function(n, callback) {
      n.to({
        duration: FADE_TIME,
        opacity: 0,
        callback: callback
      });
    },

    _fadeInOut: function(n, callback) {
      this._fadeIn(n, this._fadeOut.bind(this, n, callback.bind(this)));
    },

    _fadeInOutGroupNodes: function(g, callback) {
      var nodes = g.getChildren();
      var fadeOutAfter = Math.ceil(g.size() / 2);
      var i = 0, j = 0;

      var fadeInNode = function() {
        if (i === g.size()) {
          return;
        }

        if (i === fadeOutAfter) {
          fadeOutNode();
        }

        this._fadeIn(nodes[i++], fadeInNode);
      }.bind(this);

      var fadeOutNode = function() {
        if (j === g.size()) {
          callback.call(this);
        } else {
          this._fadeOut(nodes[j++], fadeOutNode);
        }
      }.bind(this);

      fadeInNode();
    },

    _animateHint: function(conf) {
      var nextClb;
      
      if (conf.hintEvt) {
        this.fire(conf.hintEvt);
        this.getLayer().draw();
        
        nextClb = function() {
          this._fadeIn(this.objects, function() {
            this._fadeInOutGroupNodes(this.texts[conf.group], function() {
              this._fadeOut(this.objects, function() {
                this._destroyObjects();
                conf.callback.call(this);
              }.bind(this));
            }.bind(this));
          }.bind(this));
        }.bind(this);
      } else {
        nextClb = this._fadeInOutGroupNodes.bind(this, this.texts[conf.group], conf.callback.bind(this));
      }
      
      $.delay(HINT_DELAY, nextClb);
    },

    _beforeAnimateHints: function(callback) {
      this.darkOverlay.to({
        duration: DARK_OVERLAY_ANIMATION_TIME,
        opacity: DARK_OVERLAY_OPAICTY,
        callback: this._fadeInOut.bind(this, this.texts.quickHints, callback.bind(this))
      });
    },

    _afterAnimateHints: function(callback) {
      this.darkOverlay.to({
        duration: DARK_OVERLAY_ANIMATION_TIME,
        opacity: 0,
        callback: function() {
          this._destroyObjects();
          this._fadeInOut(this.texts.goodLuck, callback);
        }.bind(this)
      });
    },
    
    _execExternalCallback: function(callback, delay, layer) {
      if (delay) {
        layer.draw();
        $.delay(SKIP_CALLBACK_DELAY, callback);
      } else {
        callback();
      }
    },

    _finishAnimatingIntro: function(delayCallback) {
      this.texts.title.destroy();

      var clb = this.introCallback;
      var layer = this.getLayer();
      delete this.introCallback;
      
      this._execExternalCallback(clb, delayCallback, layer);
    },

    _destroyAndExit: function(delayCallback) {
      var layer = this.getLayer();
      
      this.destroy();
      this._execExternalCallback(this.hintsCallback, delayCallback, layer);
    },

    animateHints: function(callback) {
      this.hintsCallback = callback;

      this._beforeAnimateHints(function() {
        this._animateHint({
          hintEvt: 'hintScore',
          group: 'scoreHint',
          callback: function() {
            this._animateHint({
              hintEvt: 'hintActiveCircle',
              group: 'aCircleHint',
              callback: function() {
                this._animateHint({
                  hintEvt: 'hintPassiveCircle',
                  group: 'pCircleHint',
                  callback: function() {
                    this._animateHint({
                      hintEvt: 'hintCircle',
                      group: 'circleHint',
                      callback: function() {
                        this._animateHint({
                          group: 'bigCircleHint',
                          callback: function() {
                            this._afterAnimateHints(this._destroyAndExit);
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      });
    },

    animateIntro: function(callback) {
      this.introCallback = callback;
      this.texts.title.to({
        duration: TITLE_ANIMATION_TIME,
        opacity: 0,
        callback: this._finishAnimatingIntro.bind(this)
      });
    },

    destroy: function() {
      Kinetic.Group.prototype.destroy.call(this);
      delete Image.text.intro;
    }
  });

  Kinetic.Util.extend(Class, Kinetic.Group);

  return Class;
})();