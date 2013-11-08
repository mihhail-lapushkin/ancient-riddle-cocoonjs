Kinetic.Game = (function() {
  var CIRCLE_AREA_TO_SCREEN_REL = 0.04;
  var MARKER_TO_MAX_CIRCLE_REL = 0.1;
  var FADE_TIME = 0.5;

  var Class = $.Class({
    _init_: function(config) {
      Kinetic.Group.call(this, config);

      this.add(this.connections = new Kinetic.Group({ listening: false }));
      this.add(this.circles = new Kinetic.Group({ listening: false }));
      this.add(this.hud = this._createHUD());
      this.add(this.pressCatcher = this._createPressCatcher());
    },

    _createHUD: function() {
      return new Kinetic.HUD({
        width: this.getWidth(),
        height: this.getHeight(),
        unit: this.attrs.unit,
        padding: this.attrs.padding,
        listening: false,
        opacity: 0
      });
    },

    _createPressCatcher: function() {
      return new Kinetic.PressCatcher({
        width: this.getWidth(),
        height: this.getHeight(),
        onPress: this._skipFadeIn.bind(this),
        visible: false
      });
    },

    _setGroupOpacity: function(g, o) {
      g.each(function(el) {
        el.setOpacity(o);
      });
    },

    _fadeInObject: function(obj, callback) {
      obj.to({
        opacity: 1,
        duration: FADE_TIME,
        easing: 'EaseOut',
        callback: callback
      });
    },

    _fadeOutObject: function(obj, callback) {
      obj.to({
        opacity: 0,
        duration: FADE_TIME,
        easing: 'EaseIn',
        callback: callback
      });
    },

    _spreadingFadeIn: function(circles, conns, state, callback) {
      circles.forEach(function(c) {
        if (state.triggered[c._id] || c.getOpacity() === 1) return;
        state.triggered[c._id] = true;

        this._fadeInObject(c);

        $.delay(FADE_TIME, function() {
          this._spreadingFadeIn(c.getNeighbours(), c.getConnections(), state, callback);
        }.bind(this));
      }.bind(this));

      $.delay(FADE_TIME / 2, function() {
        conns.forEach(function(c) {
          if (state.triggered[c._id] || c.getOpacity() === 1) return;
          state.triggered[c._id] = true;

          this._fadeInObject(c, function() {
            if (--state.left === 0) {
              callback();
            }
          });
        }.bind(this));
      }.bind(this));
    },
    
    _afterSpreadingFinished: function() {
      this.pressCatcher.hide();
      this.hud.fadeIn(this.fadeInCallback);
    },

    _prepareFadeIn: function() {
      this.pressCatcher.show();  
      this.setListening(false);
      this.hud.setOpacity(0);
      this.connections.setOpacity(1);
      this.circles.setOpacity(1);
      this._setGroupOpacity(this.circles, 0);
      this._setGroupOpacity(this.connections, 0);
    },
    
    _skipFadeIn: function() {
      [ this.circles, this.connections ].forEach(function(g) {
        g.each(function(c) {
          c.finishTween();
          c.setOpacity(1);      
        });
      });
      
      this._afterSpreadingFinished.call(this);
    },

    fadeIn: function(callback) {
      this.fadeInCallback = callback;
      this._prepareFadeIn();

      var circles = this.circles.getChildren();
      var initCircle = circles[Random.intgr(0, circles.length - 1)];
      var initState = { left: this.connections.size(), triggered: {} };

      this._spreadingFadeIn([ initCircle ], [], initState, this._afterSpreadingFinished.bind(this));
    },

    fadeOut: function(callback) {
      this.setListening(false);
      this._fadeOutObject(this.hud, function() {
        this._fadeOutObject(this.connections, function() {
          this._fadeOutObject(this.circles, callback);
        }.bind(this));
      }.bind(this));
    },

    initCircles: function(circles) {
      this._clear();

      var area = this.getWidth() * this.getHeight();
      var maxRadius = Math.floor(Math.sqrt(area * CIRCLE_AREA_TO_SCREEN_REL / Math.PI)) - 1;
      var radiusFunc = function(s, max) {
        return maxRadius * Math.sqrt(s / max);
      };

      circles.forEach(function(circle) {
        var c = new Kinetic.GameCircle({
          id: circle.id,
          x: circle.x,
          y: circle.y,
          active: circle.active,
          score: circle.score,
          radiusFunc: radiusFunc,
          connection: {
            parent: this.connections,
            markerRadius: maxRadius * MARKER_TO_MAX_CIRCLE_REL
          }
        });

        this.circles.add(c);
      }.bind(this));

      this._connectCircles(circles);
    },
     
    setListening: function(f) {
      this.connections.setListening(f);
      this.circles.setListening(f);
      this.hud.setListening(f);
    },  

    _clear: function() {
      this.circles.destroyChildren();
      this.connections.destroyChildren();
    },

    _connectCircles: function(circles) {
      circles.forEach(function(circle) {
        var v = this.circles.get('#' + circle.id).first();

        circle.connections.forEach(function(conn) {
          var u = this.circles.get('#' + conn).first();

          v.connect(u);
        }.bind(this));
      }.bind(this));
    }
  });

  Kinetic.Util.extend(Class, Kinetic.Group);

  return Class;
})();