var _ = require('underscore');

var Messages = require('../Messages.js');
var utils   = require('../Utils.js');
var id = utils.idGenFactory();

var Ship = function( config ){
  config = config || {};
  this.id       = this.PRFX_ID + id();
  this.position = config.position || [0.5, 0.8];
  this.speed    = config.speed    || [0,0];
  this.rockets  = config.rockets  || [];
  this.size     = [0.04, 0.046];
  this.isInvincible      = false;
  this.invincibleTimeout = null;
}

var accel = function accel(i){
  return Math.min(0.003, 0.0001 * i);
};

var Physics = {
  friction : function( speed, coef, deltaT ){
    return [
      speed[0] * coef,
      speed[1] * coef
    ];
  },
  move : function( position, speed, deltaT, screenBounds, shipSize){
    return [
      Math.min(
        Math.max(
          screenBounds[0][0],
          position[0] + speed[0] * deltaT),
        screenBounds[0][1] - shipSize[0]),
      Math.min(
        Math.max(
          screenBounds[1][0],
          position[1] + speed[1] * deltaT),
        screenBounds[1][1] - shipSize[1])
    ];
  },
};

Ship.prototype = {
  PRFX_ID: "SHIP",
  _left  : function( i ){ this.speed[0] -= accel(i); },
  _right : function( i ){ this.speed[0] += accel(i); },
  _up    : function( i ){ this.speed[1] -= accel(i); },
  _down  : function( i ){ this.speed[1] += accel(i); },
  thrust: function( keyCounts ) {
    var newState = this._copy();
    newState._up(    keyCounts[0] );
    newState._right( keyCounts[1] );
    newState._down(  keyCounts[2] );
    newState._left(  keyCounts[3] );
    return newState;
  },
  tick  : function( deltaT, world ){
    var newState = this._copy();
    newState.speed = Physics.friction( newState.speed, 0.3, deltaT );
    newState.position = Physics.move( newState.position, newState.speed, deltaT, [[0,1], [0,1]], newState.size);
    if(newState.isInvincible && newState.invincibleTimeout < Date.now() )
      newState.isInvincible = false;
    return newState;
  },
  collide: function(){
    if(this.isInvincible) return;

    Messages.post( Messages.ID.SHIP_DESTROYED, Messages.channelIDs.GAME, this.id);
    Messages.post( Messages.ID.EXPLOSION, Messages.channelIDs.FX, this.position);
    Messages.post( Messages.ID.FLASH, Messages.channelIDs.FX, this.position);

    this.isInvincible = true;
    this.invincibleTimeout = Date.now() + 1000;
    this.position = [0.5, 0.8];
  },
  _copy: function(){
    return new Ship( this )
  }
};

module.exports = Ship;
