Point = $.Class({
  _init_: function(x, y) {
    this.x = x;
    this.y = y;
  },

  distance: function(p) {
    return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2));
  }
});