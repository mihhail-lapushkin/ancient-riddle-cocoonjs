Kinetic.Easings.SoftBackEaseOut = function(t, b, c, d, a, p) {
  var s = 1;
  return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
};

Kinetic.Easings.SoftBackEaseIn = function(t, b, c, d, a, p) {
  var s = 1;
  return c * (t /= d) * t * ((s + 1) * t - s) + b;
};

Kinetic.Easings.SoftBackEaseInOut = function(t, b, c, d, a, p) {
  var s = 1;
  if ((t /= d / 2) < 1) {
    return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
  }
  return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
};