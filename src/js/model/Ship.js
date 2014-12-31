var _ = require('underscore');

var Messages = require('../Messages.js');
var utils   = require('../Utils.js');
var id = utils.idGenFactory();

var Ship = function( config ){
  config = config || {};
  this.id       = this.PRFX_ID + id();
  this.position = config.position || [0.5, 0.8];
  this.speed    = config.speed    || [0,0];
  this.size     = [0.04, 0.046];
  this.isInvincible      = config.isInvincible || false;
  this.invincibleTimeout = config.invincibleTimeout || null;
}

var accel = function accel(i, currentSpeed){
  if(i === 0) return currentSpeed;
  var normalizedValue = Math.min( 8, Math.max( Math.pow(i / 16 - 1, 2), 4));
  return 0.0001 * normalizedValue;
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
  _left  : function( i ){ this.speed[0] = -accel(i, this.speed[0]); },
  _right : function( i ){ this.speed[0] = -accel(i, this.speed[0]); },
  _up    : function( i ){ this.speed[1] = -accel(i, this.speed[1]); },
  _down  : function( i ){ this.speed[1] =  accel(i, this.speed[1]); },
  thrust: function( keyCounts ) {
    var newState = this._copy();
    newState.speed = [0,0];
    newState._up(    keyCounts[0] );
    newState._right( keyCounts[1] );
    newState._down(  keyCounts[2] );
    newState._left(  keyCounts[3] );
    return Object.freeze(newState);
  },
  tick  : function( deltaT, world ){
    var newState = this._copy();
    newState.position = Physics.move( newState.position, newState.speed, deltaT, [[0,1], [0,1]], newState.size);
    if(newState.isInvincible && newState.invincibleTimeout < Date.now() )
      newState.isInvincible = false;
    return Object.freeze(newState);
  },
  collide: function( world, nextT ){
    if(this.isInvincible) return this;

    Messages.post( Messages.ID.SHIP_DESTROYED, Messages.channelIDs.GAME, this.id);
    Messages.post( Messages.ID.EXPLOSION, Messages.channelIDs.FX, this.position);
    Messages.post( Messages.ID.FLASH, Messages.channelIDs.FX, this.position);

    var newState = this._copy();
    newState.isInvincible = true;
    newState.invincibleTimeout = nextT + 1000;
    newState.position = [0.5, 0.8];

    return Object.freeze(newState);
  },
  _copy: function(){
    return new Ship( this )
  }
};

module.exports = Ship;
