Controller = (function() {
  var ctrs = {};

  var Class = $.Class({
    _init_: function(name) {
      ctrs[name] = this;
    },

    ctrInit: function() {},

    ctr: function(name) {
      return ctrs[name];
    }
  });

  Class.extended = function(cls) {
    var cls = new cls();
    ctrs[cls.ctrName] = cls;
  };

  Class.initAll = function() {
    for (var c in ctrs) {
      ctrs[c].ctrInit();
    }
  };

  return Class;
})();