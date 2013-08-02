Utils = $ = (function() {
  return {
    Class: function(newClass) {
      var constructor = newClass._init_ || function() {};
      var extendsFrom = newClass.extend;
      constructor.prototype = newClass;
      newClass._init_ = undefined;
      newClass.extend = undefined;

      if (extendsFrom) {
        this.extend(constructor, extendsFrom);
      }

      if (extendsFrom && extendsFrom.extended) {
        extendsFrom.extended(constructor);
      }

      return constructor;
    },

    extend: function(c1, c2) {
      for (var key in c2.prototype) {
        if (!(key in c1.prototype)) {
          c1.prototype[key] = c2.prototype[key];
        }
      }
    },

    type: function(v) {
      return Object.prototype.toString.call(v);
    },

    copy: function(obj) {
      Array.prototype.slice.call(arguments, 1).forEach(function(source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      });
      return obj;
    },

    clone: function(obj) {
      return this.copy({}, obj);
    },

    delay: function(duration, callback) {
      return setTimeout(callback, duration * 1000);
    }
  };
})();