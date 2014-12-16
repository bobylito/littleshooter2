var _ = require('underscore');

var Messages = require('../Messages.js');
var utils   = require('../Utils.js');
var id = utils.idGenFactory();

var Ship = function(){
  this.position = [0.5, 0.8];
  this.speed = [0,0];
  this.rockets = [];
  this.size = [0.04, 0.046];
  this.isInvincible = false;
  this.invincibleTimeout = null;
  this.id = this.PRFX_ID + id();
}

var accel = function accel(i){
  return Math.min(0.003, 0.0001 * i); 
};
Ship.prototype = {
  PRFX_ID: "SHIP",
  left  : function( i ){ this.speed[0] -= accel(i); },
  right : function( i ){ this.speed[0] += accel(i); },
  up    : function( i ){ this.speed[1] -= accel(i); },
  down  : function( i ){ this.speed[1] += accel(i); },
  tick  : function( deltaT, world ){
    this.move(deltaT);
  },
  move  : function( deltaT ){
    var halfSize = [this.size[0] / 2, this.size[1] / 2];
    this.speed[0] *= 0.3;
    this.speed[1] *= 0.3;
    this.position[0] = Math.min(Math.max(0,
           this.position[0] + this.speed[0] * deltaT), 1 - this.size[0]);
    this.position[1] = Math.min(Math.max(0,
          this.position[1] + this.speed[1] * deltaT), 1 - this.size[1]);
    if(this.isInvincible && this.invincibleTimeout < Date.now() )
      this.isInvincible = false;
  },
  collide: function(){
    if(this.isInvincible) return;

    Messages.post( Messages.ID.SHIP_DESTROYED, Messages.channelIDs.GAME, this.id);
    Messages.post( Messages.ID.EXPLOSION, Messages.channelIDs.FX, this.position);
    Messages.post( Messages.ID.FLASH, Messages.channelIDs.FX, this.position);

    this.isInvincible = true;
    this.invincibleTimeout = Date.now() + 1000;
    this.position = [0.5, 0.8];
  }
};

module.exports = Ship;
