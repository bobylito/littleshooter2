var Messages = require('../Messages.js');
var _ = require('underscore');

//Player
var Player = function(){
  this.score = 0;
  this.life = 3;
}

Player.prototype = {
  constructor: Player
};

module.exports = Player;
