Difficulty = {
  EASY: 1,
  NORMAL: 2,
  HARD: 3,

  each: function(fn) {
    for (var k in this) {
      if (k !== 'each') fn(this[k], k);
    }
  }
};