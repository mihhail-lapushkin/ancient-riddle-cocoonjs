AudioLoader = (function() {
  var TYPE_TO_EXT = {
    'audio/ogg': 'ogg',
    'audio/mpeg': 'mp3'
  };

  var audioExt;
  var dummyAudio = new Audio();

  for (var type in TYPE_TO_EXT) {
    if (dummyAudio.canPlayType(type)) {
      audioExt = TYPE_TO_EXT[type];
      break;
    }
  }

  return $.Class({
    extend: AbstractLoader,

    _init_: function() {
      AbstractLoader.apply(this, arguments);
    },

    load: function(basePath, snds) {
      if (!audioExt) throw ('No supported audio types!');

      var formats = {};
      formats[audioExt] = snds;

      this._loadResources(formats, basePath + '/' + audioExt + '/', Audio);
    },

    _loadResource: function(files, basePath, file, ext, onload) {
      var path = basePath + file + '.' + ext;
      var res = new Audio();
      
      res.addEventListener('canplay', onload);
      res.src = path;

      files[file] = res;
    }
  });
})();