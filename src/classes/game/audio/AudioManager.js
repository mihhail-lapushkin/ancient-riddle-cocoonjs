AudioManager = (function() {
  var DELAY_BETWEEN_TRACKS = 3;
  var tracks = [];
  var currentTrack;

  function traverseAndSetMute(obj, mute) {
    for (var k in obj) {
      var v = obj[k];

      if (v.volume !== undefined) {
        v.volume = mute ? 0 : 1;
      } else {
        traverseAndSetMute(v, mute);
      }
    }
  }

  function initTracks() {
    for (var name in Audio.music) {
      tracks.add(Audio.music[name]);
    }
  }

  function startFirstTrack(shuffle) {
    if (tracks.isEmpty())
      return;

    startTrack(currentTrack = shuffle ? Random.intgr(0, tracks.length - 1) : 0);
  }

  function startTrack(t) {
    tracks[t].play();
    Event.bind(tracks[t], 'ended', trackEnded);
  }

  function trackEnded() {
    Event.unbind(tracks[currentTrack], 'ended', trackEnded);
    nextTrack();
  }

  function nextTrack() {
    if (++currentTrack === tracks.length)
      currentTrack = 0;

    $.delay(DELAY_BETWEEN_TRACKS, function() {
      startTrack(currentTrack);
    });
  }

  return {
    muteSound: function(mute) {
      traverseAndSetMute(Audio.sound, mute);
    },

    muteMusic: function(mute) {
      traverseAndSetMute(Audio.music, mute);
    },

    startMusic: function(args) {
      initTracks();
      startFirstTrack(args.shuffle);
    },

    play: function(snd) {
      var a = new Audio(snd.src);
      a.volume = snd.volume;
      a.play();
    }
  };
})();