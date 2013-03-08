Kinetic.Tweens['soft-back-ease-out'] = function(t, b, c, d, a, p) {
	var s = 1;
	return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
};

Kinetic.Tweens['soft-back-ease-in'] = function(t, b, c, d, a, p) {
	var s = 1;
	return c * (t /= d) * t * ((s + 1) * t - s) + b;
};

Kinetic.Tweens['soft-back-ease-in-out'] = function(t, b, c, d, a, p) {
	var s = 1;
	if ((t /= d / 2) < 1) {
		return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
	}
	return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
};