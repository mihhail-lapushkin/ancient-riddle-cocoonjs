Level = {
  MAX: 6,

  each: function(fn) {
    for (var l = 1; l <= this.MAX; l++) {
      fn(l);
    }
  }
};