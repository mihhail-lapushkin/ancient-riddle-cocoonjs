Array.prototype.isEmpty = function() {
  return this.length === 0;
};

Array.prototype.contains = function(target) {
  return this.indexOf(target) != -1;
};

Array.prototype.add = function(el) {
  this.push(el);

  return this;
};

Array.prototype.last = function() {
  return this[this.length - 1];
};

Array.prototype.first = function() {
  return this[0];
};

Array.prototype.remove = function(el) {
  var i = this.indexOf(el);

  if (i != -1) {
    this.splice(i, 1);
  }

  return this;
};

Array.prototype.clone = function() {
  return this.slice();
};