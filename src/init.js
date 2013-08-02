(function() {
  if (Env.isDev && Dev.FLUSH_DB) {
    DAO.clearDb();
  }

  ImageLoader.isXDPI(function() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    if (Env.isDev) {
      w = Dev.WIDTH;
      h = Dev.HEIGHT;
    }

    return w > DPI.H.width && h > DPI.H.height;
  });
  
  if (!DAO.isIntroNeeded()) {
    delete Config.resources.images.files.common.png.text.intro;
  }
  
  if (!Env.isDev) {
    if (Device.is(Config.weakDevices)) {
      delete Config.resources.audio.files.music;
      DAO.musicMuted(true);
      
      ImageLoader.isXDPI(function() { return false; });
    }
  }
  
  var loaders = {
    splash: new ImageLoader(Config.resources.images.path, Config.resources.images.files.splash),
    image: new ImageLoader(Config.resources.images.path, Config.resources.images.files.common),
    audio: new AudioLoader(Config.resources.audio.path, Config.resources.audio.files)
  };

  loaders.image.progress(UI.trackLoading);
  
  Event.backPressed(function() { return false; });

  Event.allFired({
    events: [ Event.pageLoaded, loaders.splash.loaded ],
    callback: UI.showLoading
  });

  Event.allFired({
    events: [ Event.pageLoaded, loaders.image.loaded, loaders.audio.loaded ],
    callback: Controller.initAll
  });
  
  loaders = undefined;
})();