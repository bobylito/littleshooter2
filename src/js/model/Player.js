var Messages = require('../Messages.js');
var _ = require('underscore');

//Player
var Player = function( config ){
  config = config || {};
  this.score = config.score || 0;
  this.life  = config.life  || 3;
}

Player.create = function(){
  var newPlayer = new Player();
  return Object.freeze( newPlayer );
};

Player.prototype = {
  constructor: Player,
  updateScore: function( newScore ){
    var newState = new Player( this );
    newState.score += newScore;
    return Object.freeze(newState);
  },
  removeLife: function() {
    var newState = new Player( this );
    newState.life -= 1;
    return Object.freeze(newState);
  }
};

module.exports = Player;
