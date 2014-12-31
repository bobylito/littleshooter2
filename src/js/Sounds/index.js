var Howl = require('howler').Howl;
var Messages = require('../Messages');

var loaded = false;
var sprites = new Howl({
  urls : ['assets/sprites.ogg'],
  volume: 0.7,
  sprite : {
    rocket: [0, 430],
    explosion: [430, 945],
    alienRocket: [1374, 295]
  },
  onload : function(){
    Messages.post( Messages.ID.LOADED_SOUNDS, Messages.channelIDs.ROOT );
  }
});

var music = new Howl({
  urls: ['assets/song1.ogg'],
  loop: true,
  autoplay: true,
  volume: 0.8
});

module.exports = {
  sprites : sprites
};
