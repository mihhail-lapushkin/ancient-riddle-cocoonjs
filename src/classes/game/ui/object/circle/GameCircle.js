Kinetic.GameCircle = (function() {
  var MAX_SCORE = 5;
  var EXPAND = 1.2;
  var COLLAPSE = 0.95;
  var EXPAND_TIME = 0.2;
  var COLLAPSE_TIME = 0.5;
  var TO_NORMAL_TIME = 0.15;
  var FADE_OUT_TIME = 0.3;
  var FAST_ROTATE_OUT_TIME = 0.3;
  var LONG_ROTATE_OUT_TIME = 0.6;

  var Class = $.Class({
    _init_: function(config) {
      Kinetic.Image.call(this, config);

      this.attrs.connections = [];
      this.attrs._connections = [];
      this.attrs.neighbours = [];
      this.attrs.ownNeighbours = [];
      this._ownsConnection = {};

      this.on('click.circ tap.circ', this._pressed);
      this.on('radiusChange.circ', this._syncRadiusWithImageSize);
      this.on('widthChange.circ heightChange.circ', this._syncSizeWithOffset);

      this.setRadius(this._calcRadius());
      this._updateImage();
    },

    _updateImage: function() {
      var s = this.getScore();

      this.setImage(this.attrs.active ? Image.circle.active[s] : Image.circle.passive[s]);
    },

    _syncRadiusWithImageSize: function() {
      var d = this.getRadius() * 2;

      this.setSize(d, d);
    },

    _calcRadius: function(s) {
      return this.attrs.radiusFunc(this.getScore() + (s || 0), MAX_SCORE);
    },

    _syncSizeWithOffset: function() {
      this.setOffset(this.getWidth() / 2, this.getHeight() / 2);
    },

    getConnections: function() {
      return this.attrs.connections;
    },

    _removeConnection: function(conn) {
      this.attrs.connections.remove(conn);
    },

    getNeighbours: function() {
      return this.attrs.neighbours;
    },

    _removeNeighbour: function(circle) {
      this.attrs.neighbours.remove(circle);
    },

    getOwnNeighbours: function() {
      return this.attrs.ownNeighbours;
    },

    _addOwnNeighbour: function(circle) {
      this.attrs.ownNeighbours.add(circle);
      this._ownsConnection[circle._id] = true;
    },

    _removeOwnNeighbour: function(circle) {
      this.attrs.ownNeighbours.remove(circle);
      this._ownsConnection[circle._id] = false;
    },

    connections: function() {
      return this.getConnections().length;
    },

    connect: function(circle) {
      if (circle != this && !this.isConnected(circle)) {
        var conn = new Kinetic.Connection($.copy({ circles: [ this, circle ] }, this.attrs.connection));

        this.getConnections().add(conn);
        circle.getConnections().add(conn);
        this.getNeighbours().add(circle);
        circle.getNeighbours().add(this);

        this._addOwnNeighbour(circle);

        this.attrs.connection.parent.add(conn);
      }
    },

    disconnect: function(circle) {
      if (circle != this && this.isConnected(circle)) {
        var delConn;

        this.getConnections().forEach(function(conn) {
          if (conn.hasCircle(circle)) {
            delConn = conn;
          }
        });

        this._removeConnection(delConn);
        circle._removeConnection(delConn);
        this._removeNeighbour(circle);
        circle._removeNeighbour(this);

        if (this.ownsConnectionWith(circle)) {
          this._removeOwnNeighbour(circle);
        } else {
          circle._removeOwnNeighbour(this);
        }

        delConn.destroy();
      }
    },

    ownsConnectionWith: function(c) {
      return this._ownsConnection[c._id];
    },

    isConnected: function(c) {
      return this.getNeighbours().contains(c);
    },

    toggleActive: function() {
      this.attrs.active = !this.isActive();

      this._updateImage();
    },

    isActive: function() {
      return this.attrs.active;
    },

    setScore: function(s) {
      this.attrs.score = s;
    },

    getScore: function() {
      return this.attrs.score;
    },

    getPressCountLeft: function() {
      return this.getScore() * 2 + (this.isActive() ? -1 : 0);
    },

    decreaseScore: function() {
      this.setScore(this.getScore() - 1);
    },

    _playPressSound: function() {
      AudioManager.play(Audio.sound.tap.circle);
    },

    _animatePress: function() {
      var tweening = this.isTweening();
      var active = this.isActive();
      var actualRadius = this._calcRadius();
      var currRadius = this.getRadius();
      var expandRadius = !tweening ? currRadius : active ? this._calcRadius(1) : actualRadius;
      var normalRadius = tweening || active ? actualRadius : currRadius;
      
      this.to({
        radius: expandRadius * EXPAND,
        duration: EXPAND_TIME,
        easing: 'StrongEaseOut',
        callback: function() {
          this.to({
            radius: normalRadius * COLLAPSE,
            duration: COLLAPSE_TIME,
            easing: 'BackEaseInOut',
            callback: function() {
              this.to({
                radius: normalRadius,
                duration: TO_NORMAL_TIME,
                easing: 'BackEaseOut'
              });
            }
          });
        }
      });
    },

    removeCircle: function() {
      this._removeCircle();
    },

    _removeCircle: function(pressed) {
      var neighs = this.getNeighbours().clone();
      neighs.forEach(function(c) {
        c.setListening(false);
      });

      this.setListening(false);
      this.to({
        scaleX: 0,
        scaleY: 0,
        opacity: 0.1,
        rotation: Math.PI * 2,
        duration: this.getScore() > 1 ? LONG_ROTATE_OUT_TIME : FAST_ROTATE_OUT_TIME,
        callback: function() {
          var parent = this.getParent();
          var pressCountLeft = this.getPressCountLeft();
          var position = this.getPosition();
          
          neighs.forEach(function(c) {
            this.disconnect(c);
            c.setListening(true);
          }.bind(this));

          this.destroy();
          
          parent.fire((pressed ? 'pressed' : 'disconnected') + 'Removed', {
            pressCountLeft: pressCountLeft,
            position: position,
            neighbours: neighs
          });
        }
      });

      this.getConnections().forEach(function(conn) {
        conn.to({
          opacity: 0.0,
          duration: FADE_OUT_TIME
        });
      });
    },

    _pressed: function(evt) {
      evt.cancelBubble = true;

      this._playPressSound();

      if (this.isActive()) {
        if (this.getScore() === 1) {
          this._removeCircle(true);
        } else {
          this.decreaseScore();
          this._animatePress();
          this.toggleActive();

          if (this.connections() > 0) {
            this.getParent().fire('activePressed', this);
          }
        }
      } else {
        this._animatePress();
        this.toggleActive();
      }

      this.getParent().fire('onePressed', this);
    },
    
    simulatePress: function() {
      this._pressed({});
    },
    
    destroy: function() {
      Kinetic.Image.prototype.destroy.call(this);
      
      this.off('.circ');
    }
  });

  Kinetic.Util.extend(Class, Kinetic.Image);
  Kinetic.Factory.addGetterSetter(Class, 'radius');
  Kinetic.Factory.addGetterSetter(Class, 'score');

  return Class;
})();