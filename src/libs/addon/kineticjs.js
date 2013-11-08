(function() {
  var nodeClassProtos = [];
  
  for (var key in Kinetic) {
    if (Kinetic[key] && Kinetic[key].prototype) {
      for (var method in Kinetic[key].prototype) {
        if (method === '_init') {
          nodeClassProtos.push(Kinetic[key].prototype);
          break;
        }
      }
    }
  }
  
  var addNodeMethod = function(name, func) {
    nodeClassProtos.forEach(function(proto) {
      var newFunc = func;
      var oldFunc = proto[name];
      
      if (oldFunc) {
        newFunc = function() {
          oldFunc.apply(this, arguments);
          func.apply(this, arguments);
        };
      }

      proto[name] = newFunc;
    });
  };

  Kinetic.Util.addMethods(Kinetic.Group, {
    size: function() {
      return this.getChildren().length;
    },
  
    each: function(fn) {
      this.getChildren().forEach(fn);
    },
  
    centerHorizontally: function(node) {
      node.setX((this.getWidth() - node.getWidth()) / 2);
    },
  
    centerVertically: function(node) {
      node.setY((this.getHeight() - node.getHeight()) / 2);
    },
  
    center: function(node) {
      this.centerHorizontally(node);
      this.centerVertically(node);
    }
  });

  addNodeMethod('toLocalOf', function(n) {
    var nGlobal = n.getAbsolutePosition();
    var tnf = this.getAbsoluteTransform();
    tnf.invert();
    tnf.translate(nGlobal.x, nGlobal.y);
    var tns = tnf.getTranslation();

    return { x: this.getX() + tns.x, y: this.getY() + tns.y };
  });

  addNodeMethod('isTweening', function() {
    return this.tween && this.tween.anim.isRunning();
  });

  addNodeMethod('destroyTween', function() {
    if (this.tween) {
      this.tween.destroy();
    }
  });
  
  addNodeMethod('finishTween', function() {
    if (this.tween) {
      this.tween.finish();
    }
  });

  addNodeMethod('to', function(config) {
    var clb = config.callback;
    
    config.onFinish = clb ? function() {
      this.tween.destroy();
      clb.call(this);
    }.bind(this) : undefined;
    
    config.easing = Kinetic.Easings[config.easing];
    config.node = this;
    
    delete config.callback;

    this.destroyTween();
    this.tween = new Kinetic.Tween(config);
    this.tween.play();

    return this.tween;
  });
  
  addNodeMethod('destroy', function() {
    this.destroyTween();
  });

  addNodeMethod = undefined;
  nodeClassProtos = undefined;
})();