var Messages = require("../Messages");
var utils = require('../Utils.js');

var id = utils.idGenFactory();

//Baddie
/**
 * @param config : object containing the following keys 
 *  - position : vec2 (eg array of two elements)
 *  - acceleration : vec2
 *  - maxSpeed : vec2
 *  - size : vec2
 *  - life : Number
 */
var Monster = function( config ) {
  if( !config ) throw "WTF PEOPLE! no config object was provided to Monster "+
                      "therefore I am not able to build my minion. Sad day!";
  this.position     = config.position || [ Math.random(), -0.2];
  this.acceleration = config.acceleration || [0, 0.00001];
  this.speed        = [0,0];
  this.maxSpeed     = config.maxSpeed || [0, 0.0001];
  this.size         = config.size || [0.1, 0.1];
  this.life         = config.life || 3;
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
  move: function(deltaT){
    this.speed[1] = Math.min( this.maxSpeed[1], this.speed[1] + this.acceleration[1]);
    this.position[0] += this.speed[0] * deltaT;
    this.position[1] += this.speed[1] * deltaT;
    if( this.position[1] > 1.2) this.position[1] = -0.2;
    this.flash=false;
  },
  collide: function(){
    if( this.life > 0 ){
      this.life--;
      this.position[1] = this.position[1] - 0.05;
      this.speed[1] = -0.0001;
      this.flash=true;
    }
    else {
      Messages.post( Messages.ID.BADDIE_DESTROYED, Messages.channelIDs.GAME, this.id);
      Messages.post( Messages.ID.EXPLOSION, Messages.channelIDs.FX, this.position);
    }
  }
};

var Ouno = function( position ){
  Monster.call( this, {
    position     : position || [ Math.random(), -0.2],
    acceleration : [0, 0.00001],
    maxSpeed     : [0, 0.0001],
    size         : [0.1, 0.1],
    life         : 3
  });
};
Ouno.prototype = Object.create( Monster.prototype );
Ouno.prototype.constructor = Ouno;
Ouno.prototype.PRFX_ID = "ouno";

var Douo = function( position ){
  Monster.call( this, {
    position     : position || [ Math.random(), -0.2],
    acceleration : [0, 0.00001],
    maxSpeed     : [0, 0.00005],
    size         : [0.1, 0.1],
    life         : 10
  });
};
Douo.prototype = Object.create(Monster.prototype);
Douo.prototype.constructor = Douo;
Douo.prototype.PRFX_ID = "douo";

//Make it launch rockets!
var Trouo = function( position ){
  Monster.call( this, {
    position     : position || [ Math.random(), -0.2],
    acceleration : [0, 0.00002],
    maxSpeed     : [0, 0.0002],
    size         : [0.1, 0.1],
    life         : 1
  });
  this.lastFire     = 0;
};
Trouo.prototype = Object.create(Monster.prototype);
Trouo.prototype.constructor = Trouo;
Trouo.prototype.PRFX_ID = "trouo";
Trouo.prototype.afterMove = function( dt, world ){
  var x = this.position[0];
  var xPlayer = world.player.ship.position[0];
  if( world.timestamp > ( this.lastFire + 1000 ) &&
      xPlayer < x + 0.1 &&
      xPlayer > x - 0.1 ) {
    Messages.post(
      Messages.ID.ROCKET_LAUNCH,
      Messages.channelIDs.GAME,
      { pos : [ x, this.position[1] ],
        dir : [ 0, 0.001 ],
        isFromBaddies : true });
    this.lastFire = world.timestamp;
  }
};

var monsterCatalog = {
  "ouno"  : Ouno,
  "douo"  : Douo,
  "trouo" : Trouo
};
var makeMonster = function makeMonster(monsterId, position){
  var MonsterConstructor= monsterCatalog[monsterId];
  if(!constructor) throw "COME ON PEOPLE! This is not a valid monsterID!";
  else {
    return new MonsterConstructor(position);
  }
}

module.exports = {
  Ouno  : Ouno,
  Douo  : Douo,
  Trouo : Trouo,
  make  : makeMonster
};
