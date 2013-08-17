String.prototype.contains = function(s) {
  return this.indexOf(s) >= 0;
};

String.prototype.format = function() {
  var args = arguments;
  return this.replace(/\{(\d+)\}/g, function(match, number) {
    return typeof args[number] != 'undefined' ? args[number] : match;
  });
};

String.prototype.times = function(n) {
  var s = '';

  for (var i = 0; i < n; i++) {
    s += this;
  }

  return s;
};