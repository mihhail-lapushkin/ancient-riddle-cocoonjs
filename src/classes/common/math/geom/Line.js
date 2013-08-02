Line = $.Class({
  _init_: function(x1, y1, x2, y2) {
    if (x2 == x1) {
      this.m = 0;
      this.c = x1;
      this.isParallelToY = true;
    } else {
      this.m = (y2 - y1) / (x2 - x1);
      this.c = y1 - x1 * this.m;
      this.isParallelToY = false;
    }
  },

  _calcPointFromQuadEqParams: function(x, y, plusMinusSqrtOfDiscrim) {
    var m = this.m;
    var c = this.c;
    var xx = ((m * (y - c) + x) + plusMinusSqrtOfDiscrim) / (Math.pow(m, 2) + 1);

    return new Point(xx, m * xx + c);
  },

  intersectCircle: function(x, y, r) {
    if (this.isParallelToY) {
      return [ new Point(x, y - r), new Point(x, y + r) ];
    } else {
      var m = this.m;
      var c = this.c;
      var discrim = Math.pow(m * (c - y) - x, 2) - (Math.pow(m, 2) + 1) * (Math.pow(x, 2) - Math.pow(r, 2) + (c - y) * (c - y));

      if (discrim === 0) {
        return [ this._calcPointFromQuadEqParams(x, y, 0) ];
      } else if (discrim > 0) {
        var sqrtOfDiscrim = Math.sqrt(discrim);

        return [ this._calcPointFromQuadEqParams(x, y, sqrtOfDiscrim), this._calcPointFromQuadEqParams(x, y, -sqrtOfDiscrim) ];
      }
    }
  },

  intersect: function(line) {
    if (this.isParallelToY) {
      return new Point(this.c, line.m * this.c + line.c);
    } else if (line.isParallelToY) {
      return new Point(line.c, this.m * line.c + this.c);
    } else {
      var m1 = this.m;
      var m2 = line.m;
      var c1 = this.c;
      var c2 = line.c;
      var d = m1 - m2;

      return new Point((c2 - c1) / d, (c2 * m1 - c1 * m2) / d);
    }
  }
});