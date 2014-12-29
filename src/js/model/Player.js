var Messages = require('../Messages.js');
var _ = require('underscore');

//Player
var Player = function( config ){
  config = config || {
    score: 0,
    life: 3,
    weaponEnergy : 100,
    lastUsedWeaponAt: 0
  };
  this.score = config.score;
  this.life  = config.life;
  this.lastUsedWeaponAt = config.lastUsedWeaponAt;
  this.weaponEnergy = config.weaponEnergy;
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
  },
  successShoot: function(t){
    var newState = new Player( this );
    newState.lastUsedWeaponAt = t; 
    newState.weaponEnergy -= 5;
    return Object.freeze(newState);
  },
  failShoot: function(t){
    var newState = new Player( this );
    newState.lastUsedWeaponAt = t; 
    return Object.freeze(newState);
  },
  recharge: function(t, deltaT){
    if( ((t - 100) > this.lastUsedWeaponAt) ) {
      var newState = new Player(this);
      newState.weaponEnergy = Math.min(100, this.weaponEnergy + 0.05 * deltaT);
      return Object.freeze( newState );
    }
    else return this;
  },
  canShoot: function(){
    return this.weaponEnergy >= 0;
  },
  getWeaponEnergyRatio: function(){
    return this.weaponEnergy / 100;
  }
};

module.exports = Player;
