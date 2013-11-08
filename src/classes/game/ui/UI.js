UI = (function() {
  var PADDING = 0.016;
  var MAX_RATIO = 15 / 9;
  
  var dims;

  var stage;
  var canvas;
  var loading;

  var screenWidth, screenHeight;

  var layer = {};
  var publicAPI = {};

  function showLoading() {
    if (stage) return;

    initStage();
    
    canvas.add(loading = new Kinetic.Loading($.clone(dims)));
    
    loading.fadeIn();
  }

  function trackLoading(p) {
    if (!loading) return;

    loading.setPercent(p);
  }

  function build() {
    if (stage) {
      canvas.getChildren().forEach(function(c) {
        c.destroy();
      });

      loading = null;
    } else {
      initStage();
    }

    buildGroupLayers();
    buildLayoutManager();
  }

  function initStage() {
    setScreenDimensions();
    buildStage();
    calcGameDimensions();
  }

  function setScreenDimensions() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;

    if (Env.isDev) {
      screenWidth = Dev.WIDTH;
      screenHeight = Dev.HEIGHT;
    }

    LevelData.setLevelDimensions(screenWidth, screenHeight);
  }

  function buildStage() {
    stage = new Kinetic.Stage({
      container: document.body,
      width: screenWidth,
      height: screenHeight
    });

    stage.add(canvas = new Kinetic.Layer());
  }

  function calcGameDimensions() {
    dims = {
      width: stage.getWidth(),
      height: stage.getHeight(),
      padding: Math.ceil(stage.getWidth() * PADDING)
    };

    dims.unit = dims.padding * MAX_RATIO / Math.max(dims.width / dims.height, MAX_RATIO);
  }

  function buildGroupLayers() {
    canvas.add(layer.bg = new Kinetic.Background($.clone(dims)));
    canvas.add(layer.game = new Kinetic.Game($.clone(dims)));
    canvas.add(layer.inactiveDisp = new Kinetic.InactiveDisplay($.clone(dims)));
    canvas.add(layer.menu = new Kinetic.Menu($.clone(dims)));
    canvas.add(layer.gameOver = new Kinetic.GameOver($.clone(dims)));
    
    if (DAO.isIntroNeeded()) {
      canvas.add(layer.intro = new Kinetic.Intro($.clone(dims)));
    }
    
    canvas.add(layer.message = new Kinetic.Message($.clone(dims)));
    canvas.add(layer.quit = new Kinetic.Quit($.clone(dims)));
    canvas.add(layer.fading = new Kinetic.Fading($.clone(dims)));

    $.copy(publicAPI, layer);
  }

  function buildLayoutManager() {
    var turns = layer.game.hud.turns;
    var pause = layer.game.hud.pause;

    publicAPI.layoutManager = new Kinetic.LayoutManager({
      circles: layer.game.circles.getChildren(),
      connections: layer.game.connections.getChildren(),
      clearCorners: {
        tl: {
          width: turns.getSizeWidth(),
          height: turns.getHeight()
        },
        tr: {
          width: pause.getWidth(),
          height: pause.getHeight()
        }
      },
      redrawNode: canvas,
      bounds: $.clone(dims)
    });
  }

  publicAPI.build = build;
  publicAPI.showLoading = showLoading;
  publicAPI.trackLoading = trackLoading;

  return publicAPI;
})();