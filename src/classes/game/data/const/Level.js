Level = {
  MAX: 6,
  
  isLocked: function(d, l) {
    return LevelData.isLocked(d, l);
  },

  each: function(fn) {
    for (var l = 1; l <= this.MAX; l++) {
      fn(l);
    }
  }
};