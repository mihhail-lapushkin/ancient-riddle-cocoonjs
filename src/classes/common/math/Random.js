// based on: http://baagoe.org/en/wiki/Better_random_numbers_for_javascript
Random = (function() {
  var n = 0xefc8249d;

  function mash(data) {
    data = data.toString();

    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000;
    }

    return (n >>> 0) * 2.3283064365386963e-10;
  }

  var s0, s1, s2;
  var seed = Date.now();
  var c = 1;

  s0 = s1 = s2 = mash(' ');
  s0 -= mash(seed);
  s1 -= mash(seed);
  s2 -= mash(seed);

  if (s0 < 0)
    s0 += 1;
  if (s1 < 0)
    s1 += 1;
  if (s2 < 0)
    s2 += 1;

  function rand() {
    var t = 2091639 * s0 + c * 2.3283064365386963e-10;
    s0 = s1;
    s1 = s2;
    /*jshint boss:true */
    return s2 = t - (c = t | 0);
  }

  function randFloat() {
    return rand() + (rand() * 0x200000 | 0) * 1.1102230246251565e-16;
  }

  function randomObject(min, max) {
    return min + randFloat() * (max - min);
  }

  randomObject.intgr = function(min, max) {
    if (!max) {
      max = min;
      min = 0;
    }

    return Math.floor(min + randFloat() * (max - min + 1));
  };

  randomObject.bool = function() {
    return randFloat() < 0.5;
  };

  return randomObject;
})();