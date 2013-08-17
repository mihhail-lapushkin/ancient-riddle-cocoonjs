Function.prototype.repeat = function(n) {
  for (var i = 0; i < n; i++) {
    this.call();
  }

  return this;
};