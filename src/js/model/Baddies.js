var Messages = require("../Messages");
var utils = require('../Utils.js');

var id = utils.idGenFactory();

//Returns the current acceleration value
var Patterns = {
  "straight" : function straightP(deltaT, timestamp){
    return [0, 0.00001];
  },
  "square" : function squareP(deltaT, timestamp){
    var t0 = timestamp;
    var p = this.pattern = function(deltaT, timestamp){
      var elapsed = timestamp - t0;
      var c = Math.floor(elapsed / 100) % 4;
      if( c === 0 ) return [0, 0.00001];
      else if( c === 1 ) return [0.000005, 0];
      else if( c === 2 ) return [0, 0.00001];
      else if( c === 3 ) return [-0.000005, 0];
      else {
        console.log( "Invariant break : c should be in [0,3], was ", c);
        return [0, 0.00001];
      }
    };
    return p(deltaT, timestamp);
  }
};

//Baddie
/**
 * @param config : object containing the following keys 
 *  - position : vec2 (eg array of two elements)
 *  - maxSpeed : vec2
 *  - size : vec2
 *  - life : Number
 *  - weight : Number 
 *  - pattern : (deltaT: Number, timestamp: Number) => acceleration: vec2 
 */
var Monster = function( config ) {
  if( !config ) throw "WTF PEOPLE! no config object were provided to Monster "+
                      "therefore I am not able to build my minion. Sad day!";
  this.position     = config.position || [ Math.random(), -0.2];
  this.speed        = [0,0];
  this.maxSpeed     = config.maxSpeed || [0.0001, 0.0001];
  this.size         = config.size || [0.1, 0.1];
  this.life         = config.life || 3;
  this.weight       = config.weight || 1;
  this.pattern      = config.pattern ? (Patterns[config.pattern]).bind(this) :
                                       (Patterns.straight).bind(this);
  this.id           = this.PRFX_ID + id();
}

Monster.prototype = {
  PRFX_ID : null,
  tick: function( deltaT, world ){
    if(this.afterMove) {
      this.tick = function( dt, w ){
        this.move(dt, w);
        this.afterMove(dt, w);
      };
    }
    else {
      this.tick = this.move;
    }
    this.tick( deltaT, world );
  },
  move: function(deltaT, world){
    var acc = this.pattern(deltaT, world.timestamp);
    this.speed[0] = Math.min( this.maxSpeed[0], this.speed[0] + acc[0]);
    this.speed[1] = Math.min( this.maxSpeed[1], this.speed[1] + acc[1]);
    this.position[0] += this.speed[0] * deltaT;
    this.position[1] += this.speed[1] * deltaT;
    if( this.position[1] > 1.2) this.position[1] = -0.2;
    this.flash=false;
  },
  collide: function(){
    if( this.life > 0 ){
      this.life--;
      this.position[1] = this.position[1] - (0.08 / (this.weight * this.weight)) ;
      this.speed[1] = -0.0001;
      this.flash=true;
    }
    else {
      Messages.post( Messages.ID.BADDIE_DESTROYED, Messages.channelIDs.GAME, this.id);
      Messages.post( Messages.ID.EXPLOSION, Messages.channelIDs.FX, this.position);
    }
  }
};

var Ouno = function( position, movePattern){
  Monster.call( this, {
    position     : position || [ Math.random(), -0.2],
    maxSpeed     : [0.0003, 0.0003],
    size         : [0.04, 0.04],
    weight       : 1,
    life         : 3,
    pattern      : movePattern
  });
};
Ouno.prototype = Object.create( Monster.prototype );
Ouno.prototype.constructor = Ouno;
Ouno.prototype.PRFX_ID = "ouno";

var Douo = function( position, movePattern ){
  Monster.call( this, {
    position     : position || [ Math.random(), -0.2],
    maxSpeed     : [0.0001, 0.0001],
    size         : [0.04, 0.04],
    weight       : 4,
    life         : 20,
    pattern      : movePattern
  });
  this.lastFire     = 0;
};
Douo.prototype = Object.create(Monster.prototype);
Douo.prototype.constructor = Douo;
Douo.prototype.PRFX_ID = "douo";
Douo.prototype.afterMove = function( dt, world ){
  var x = this.position[0] + this.size[0]/2;
  var xPlayer = world.player.ship.position[0];
  if( world.timestamp > ( this.lastFire + 1000 ) &&
      xPlayer < x + 0.1 &&
      xPlayer > x - 0.1 ) {
    Messages.post(
      Messages.ID.ROCKET_LAUNCH,
      Messages.channelIDs.GAME,
      { pos : [ x , this.position[1] ],
        dir : [ 0, 0.001 ],
        isFromBaddies : true });
    this.lastFire = world.timestamp;
  }
};

//Make it launch rockets!
var Trouo = function( position, movePattern ){
  Monster.call( this, {
    position     : position || [ Math.random(), -0.2],
    maxSpeed     : [0.0005, 0.0005],
    size         : [0.04, 0.04],
    weight       : 0.75,
    life         : 1,
    pattern      : movePattern
  });
};
Trouo.prototype = Object.create(Monster.prototype);
Trouo.prototype.constructor = Trouo;
Trouo.prototype.PRFX_ID = "trouo";

var monsterCatalog = {
  "ouno"  : Ouno,
  "douo"  : Douo,
  "trouo" : Trouo
};
var makeMonster = function makeMonster(monsterId, position, movePattern){
  var MonsterConstructor= monsterCatalog[monsterId];
  if(!constructor) throw "COME ON PEOPLE! This is not a valid monsterID!";
  else {
    return new MonsterConstructor(position, movePattern);
  }
}

module.exports = {
  Ouno  : Ouno,
  Douo  : Douo,
  Trouo : Trouo,
  make  : makeMonster
};
