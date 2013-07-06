if (navigator.isCocoonJS) {
  console.log('User Agent: ' + navigator.userAgent);
  console.log('Platform: ' + navigator.platform);
  console.log('Vendor: ' + navigator.vendor);
  console.log('App Version: ' + navigator.appVersion);
  console.log('Browser: ' + navigator.browser);

  document._createElement = document.createElement;
  var firstCanvas = true;
  
  document.createElement = function(el) {
    if (el === 'canvas' && firstCanvas) {
      firstCanvas = false;
      el = 'screencanvas';
    }

    return this._createElement(el);
  };
}