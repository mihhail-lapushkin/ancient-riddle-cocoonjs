if (!Array.isArray) {
  Array.isArray = function (v) {
    return Object.prototype.toString.call(v) === '[object Array]';
  };
}

if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(iterator, context) {
		if (this.length === +this.length) {
			for (var i = 0, l = this.length; i < l; i++) {
				if (i in this) iterator.call(context, this[i], i, this);
			}
		} else {
			for (var key in this) {
				if (Object.prototype.hasOwnProperty.call(this, key)) {
					iterator.call(context, this[key], key, this);
				}
			}
		}
	};
}

if (!Array.prototype.indexOf) {
	var sortedIndex = function(array, obj, iterator) {
		/*jshint expr:true */
		iterator || (iterator = function(v) { return v; });
		var low = 0, high = array.length;
		while (low < high) {
			var mid = (low + high) >> 1;
			iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
		}
		return low;
	};

	Array.prototype.indexOf = function(item, isSorted) {
		var i, l;
		if (isSorted) {
			i = sortedIndex(array, item);
			return this[i] === item ? i : -1;
		}
		for (i = 0, l = this.length; i < l; i++) {
			if (i in this && this[i] === item) { return i; }
			
			return -1;
		}
	};
}

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