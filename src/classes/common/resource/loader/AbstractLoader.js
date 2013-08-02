AbstractLoader = (function() {
  return $.Class({
    _init_: function() {
      this.loaded = this.loaded.bind(this);

      this.reset();

      if (arguments.length > 0) {
        this.load.apply(this, arguments);
      }
    },

    load: function() {
      throw ("Must override abstract method 'load'!");
    },

    reset: function() {
      this._loadedListeners = [];
      this._progressListeners = [];
      this._loaded = false;
    },

    loaded: function(fn) {
      if (this._loaded) {
        fn();
      } else {
        this._loadedListeners.add(fn);
      }
    },

    progress: function(fn) {
      this._progressListeners.add(fn);
    },

    _notifyLoadedListeners: function() {
      this._loaded = true;
      this._loadedListeners.forEach(function(l) {
        l();
      });
    },

    _notifyProgressListeners: function(p) {
      this._progressListeners.forEach(function(l) {
        l(p);
      });
    },

    /*jshint loopfunc:true */
    _traverseAndLoad: function(inObj, outObj, path, ext, beforeLoad, onload) {
      for (var k in inObj) {
        var v = inObj[k];

        if (!Array.isArray(v)) {
          outObj[k] = outObj[k] || {};
          this._traverseAndLoad(inObj[k], outObj[k], path + k + '/', ext, beforeLoad, onload);
        } else {
          var files;
          var basePath = path;

          if (k === '_') {
            files = outObj;
          } else {
            basePath += k + '/';
            files = outObj[k] = (outObj[k] || {});
          }

          beforeLoad(v);

          v.forEach(function(file) {
            this._loadResource(files, basePath, file, ext, onload);
          }.bind(this));
        }
      }
    },

    _loadResource: function() {
      throw ("Must override abstract method '_loadResource'!");
    },

    _loadResources: function(formats, basePath, resObject) {
      var loading = 0;
      var loaded = 0;

      function beforeLoad(arr) {
        loading += arr.length;
      }

      var onload = function() {
        this._notifyProgressListeners(loaded / loading);

        if (++loaded >= loading) {
          this._notifyLoadedListeners();
        }
      }.bind(this);

      for (var formatName in formats) {
        this._traverseAndLoad(formats[formatName], resObject, basePath, formatName, beforeLoad, onload);
      }
    }
  });
})();