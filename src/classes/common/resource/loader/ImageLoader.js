ImageLoader = (function() {
  var isXDPI = function() { return false; };

  var Class = $.Class({
    extend: AbstractLoader,
    _init_: function() {
      AbstractLoader.apply(this, arguments);
    },

    load: function(basePath, formats) {
      this._loadResources(formats, basePath + '/' + (isXDPI() ? 'x' : 'h') + 'dpi/', Image);
    },

    _loadResource: function(files, basePath, file, ext, onload) {
      var res = new Image();

      res.onload = onload;
      res.src = basePath + file + '.' + ext;

      files[file] = res;
    }
  });

  Class.isXDPI = function(fn) {
    isXDPI = fn;
  };

  return Class;
})();