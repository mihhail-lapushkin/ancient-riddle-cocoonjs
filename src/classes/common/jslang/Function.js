Function.prototype.repeat = function(n) {
  for ( var i = 0; i < n; i++) {
    this.call();
  }

  return this;
};

if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    var aArgs = Array.prototype.slice.call(arguments, 1);
    var fToBind = this;
    var fNOP = function() {};
    
    function fBound() {
      return fToBind.apply(this instanceof fNOP ? this : oThis || window, aArgs.concat(Array.prototype.slice.call(arguments)));
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}