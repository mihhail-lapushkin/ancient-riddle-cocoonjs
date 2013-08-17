Config = {
  weakDevices: [ 'android 2.3', 'ipad_1' ],
  resources: {
    levels: {
      pathFormat: 'resources/lvl/{0}/{1}',
      meta: {
        initiallyLocked: [
          [ 0, 0, 0, 0, 0, 0 ],
          [ 0, 1, 1, 1, 1, 1 ],
          [ 0, 1, 1, 1, 1, 1 ]
        ]
      }
    },
    
    images: {
      path: 'resources/img',
      files: {
        splash: {
          png: {
            text: [ 'dot', 'loading' ]
          }
        },
        
        common: {
          png: {
            digit: {
              pos:  [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
              neg:  [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
              big:  [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
              _:    [ 'separator' ]
            },

            text: {
              levelName: {
                '1': [ 1, 2, 3, 4, 5, 6 ],
                '2': [ 1, 2, 3, 4, 5, 6 ],
                '3': [ 1, 2, 3, 4, 5, 6 ]
              },
              intro:  [ 'title',
                        'goodLuck',
                        'quickHints',
                        'aCircleHint1', 'aCircleHint2',
                        'pCircleHint1', 'pCircleHint2', 'pCircleHint3',
                        'circleHint1', 'circleHint2', 'circleHint3', 'circleHint4',
                        'bigCircleHint1', 'bigCircleHint2', 'bigCircleHint3', 'bigCircleHint4',
                        'scoreHint1', 'scoreHint2' ],
              _:      [ 'continuing', 'difficulty', 'level', 'score', 'quit', 'limit', 'skipped', 'highScore', 'worseScore', 'sameScore', 'completed', 'unlocked', 'tapsLost' ]
            },

            icon: [ 'empty', 'plus', 'minus', 'equal', 'locked' ],

            circle: {
              active:     [ 1, 2, 3, 4, 5 ],
              passive:    [ 1, 2, 3, 4, 5 ],
              connection: [ 'marker' ]
            },

            menu: {
              side: [ 'left', 'right' ]
            },

            button: {
              progress: {
                small: [ 'base', 'hand', 'complete', 'empty' ],
                large: [ 'base', 'hand', 'complete', 'empty' ]
              },
              difficulty: [ 'easy', 'normal', 'hard', 'choose' ],
              music:      [ 'on', 'off' ],
              sound:      [ 'on', 'off' ],
              quit:       [ 'yes', 'no' ],
              _:          [ 'pause', 'restart', 'resume', 'next' ]
            },

            bg: [ 'trans' ]
          },
          
          jpg: {
            bg: [ 'normal', 'gs' ]
          }
        }
      }
    },
  
    audio: {
      path: 'resources/aud',
      files: {
        sound: {
          tap:  [ 'circle', 'button' ],
          _:    [ 'tick' ]
        },
        music:  [ 1, 2, 3, 4, 5 ]
      }
    }
  }
};