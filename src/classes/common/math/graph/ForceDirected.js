// based on: http://www.kylescholz.com/blog/2006/06/force_directed_graphs_in_javas.html
ForceDirected = (function() {
  var BASE_VALUE = 800;

  return $.Class({
    _init_: function(config) {
      config.bvFactor = BASE_VALUE / config.maxDim;

      $.copy(this, config);
    },

    runOnce: function() {
      var op = this.operations;
      var k = this.bvFactor;
      var agr = this.antiGravityReach;
      var ag = this.antiGravity;
      var np = this.nodePadding;
      var g = this.gravity;

      this.circles.forEach(function(v) {
        this.circles.forEach(function(u) {
          if (!op.equals(v, u)) {
            var vx = op.getX(v) * k, vy = op.getY(v) * k;
            var ux = op.getX(u) * k, uy = op.getY(u) * k;
            var vr = op.radius(v) * k, ur = op.radius(u) * k;

            var dx = vx - ux;
            var dy = vy - uy;
            var d2 = Math.pow(dx, 2) + Math.pow(dy, 2);
            var d = Math.sqrt(d2);
            var dxd = dx / d, dyd = dy / d;

            // apply attractive force across the connection
            if (op.ownsEdgeTo(v, u)) {
              var dmr = d - vr - ur - np * Math.max(vr, ur);

              if (dmr > 0) {
                var attractiveForce = Math.log(Math.pow(dmr, g) / (op.owningEdges(v) + op.owningEdges(u)));
                var moveX = attractiveForce * dxd, moveY = attractiveForce * dyd;

                op.setX(v, (vx -= moveX) / k);
                op.setY(v, (vy -= moveY) / k);
                op.setX(u, (ux += moveX) / k);
                op.setY(u, (uy += moveY) / k);
              }
            }

            // apply repulsive force between every node
            var repulsiveForce = BASE_VALUE * ag * op.value(v) * op.value(u) / d2;
            var df = (vr + ur) * agr - d;

            if (df > 0) {
              repulsiveForce *= Math.log(df);
            }

            op.setX(v, (vx + repulsiveForce * dxd) / k);
            op.setY(v, (vy + repulsiveForce * dyd) / k);
          }
        }.bind(this));

        op.keepInBounds(v);
      }.bind(this));
    }
  });
})();