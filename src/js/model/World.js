var Messages = require('../Messages.js');
var _ = require('underscore');

var utils = require('../Utils.js');

var id = utils.idGenFactory();

//World
var World = function( timestamp ){
  this.player = new Player;
  this.baddies = [];
  this.timestamp = timestamp;
  this.firstTimestamp = timestamp;
};

//Player
var Player = function(){
  this.score = 0;
  this.life = 3;
  this.ship = new Ship();
}

//Ship
var Ship = function(){
  this.position = [0.5, 0.8];
  this.speed = [0,0];
  this.rockets = [];
  this.size = [0.04, 0.046];
  this.isInvincible = false;
  this.invincibleTimeout = null;
  this.id = this.PRFX_ID + id();
}

Ship.prototype = {
  PRFX_ID: "SHIP",
  left  : function(){ this.speed[0] -= 0.0022; },
  right : function(){ this.speed[0] += 0.0022; },
  up    : function(){ this.speed[1] -= 0.0022; },
  down  : function(){ this.speed[1] += 0.0022; },
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

var Rocket = function(pos){
  this.position = pos;
  this.speed = [0, -0.001];
  this.id = this.PRFX_ID + id();
};

Rocket.prototype = {
  PRFX_ID: "RCKT",
  move: function(deltaT){
    this.position[0] += this.speed[0] * deltaT;
    this.position[1] += this.speed[1] * deltaT;
  },
  collide: function(){
    Messages.post( Messages.ID.ROCKET_LOST, Messages.channelIDs.GAME, this.id);
  }
};

//Baddie
var Ouno = function(){
  this.position     = [ Math.random(), -0.2];
  this.acceleration = [0, 0.00001];
  this.speed        = [0, 0.0001];
  this.size         = [0.1, 0.1];
  this.life         = 3;
  this.id           = this.PRFX_ID + id();
}

Ouno.prototype = {
  PRFX_ID:"OUNO",
  move: function(deltaT){
    this.speed[1] = Math.min( 0.0001, this.speed[1] + this.acceleration[1]);
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
  },
}

var handleMessages = function(messages, world){
  //Ship movements
  if(!!messages[Messages.ID.SHIP_MOVE_UP]) world.player.ship.up();
  if(!!messages[Messages.ID.SHIP_MOVE_DOWN]) world.player.ship.down();
  if(!!messages[Messages.ID.SHIP_MOVE_LEFT]) world.player.ship.left();
  if(!!messages[Messages.ID.SHIP_MOVE_RIGHT]) world.player.ship.right();

  //Rockets
  var launchMsgs = messages[Messages.ID.ROCKET_LAUNCH] || [];
  var lostMsgs   = messages[Messages.ID.ROCKET_LOST] || [];

  if( launchMsgs.length > 0 || lostMsgs.length > 0){
    var missingRocketIds = _(lostMsgs).chain().map(function(m){
      return m.val;
    });
    var remainingRockets = _.reject(world.player.ship.rockets, function(r){
      return missingRocketIds.contains( r.id ).value();
    });
    var newRockets = _.map(launchMsgs, function(msg){
      var rocketPosition = [msg.val.pos[0], msg.val.pos[1]];
      return new Rocket( rocketPosition );
    });
    world.player.ship.rockets = remainingRockets.concat(newRockets);
  }

  //Baddies
  var destroyedBaddies = messages[Messages.ID.BADDIE_DESTROYED] || [];

  if(destroyedBaddies.length > 0){
    var missingBaddiesID = _.chain(destroyedBaddies).map(function(b){
      return b.val;
    });
    var remainingBaddies = _.reject(world.baddies, function(b){
      return missingBaddiesID.contains( b.id ).value();
    });
    world.baddies = remainingBaddies;
  }

  // Ship destruction
  var destroyedShip = messages[Messages.ID.SHIP_DESTROYED] || [];
  if(destroyedShip.length > 0) world.player.life--;

  //Points
  var newPoints = destroyedBaddies.length * 10;
  world.player.score += newPoints;
};

var worldTick = function(world, nextTimestamp){
  var deltaT = (nextTimestamp - world.timestamp) * 2;
  world.player.ship.move(deltaT);
  if(world.baddies.length < 20) {
    _.range(5).forEach( function(){
      world.baddies.push(new Ouno());
    });
  }
  world.baddies.forEach(function(b){
    b.move(deltaT);
  });
  world.player.ship.rockets.forEach(function(r){
    r.move(deltaT);
  });
  var c = testCollision(world.player.ship.rockets.concat(world.player.ship),
                        world.baddies);

  _.chain(c).flatten().uniq().forEach(function(e){
    e.collide();
  });

  var messages = Messages.get(Messages.channelIDs.GAME);
  handleMessages(messages, world);
  Messages.reset( Messages.channelIDs.GAME );

  world.timestamp = nextTimestamp;
  return world;
}

var testCollision = function(grp1, grp2){
  return _.reduce(grp1, function(collided, o1){
    return _.reduce( grp2, function(c, o2){
      if( collide(o1, o2) ) c.push( [o1, o2] );
      return c;
    }, collided);
  }, []);
};

var collide = function(i1, i2){
  return  i1.position[0] > (i2.position[0] - 0.5 * i2.size[0]) &&
          i1.position[0] < (i2.position[0] + 0.5 * i2.size[0]) &&
          i1.position[1] > (i2.position[1] - 0.5 * i2.size[1]) &&
          i1.position[1] < (i2.position[1] + 0.5 * i2.size[1])
}

var createWorld = function( timestamp ){
  return new World( timestamp );
}

module.exports = {
  create : createWorld,
  tick : worldTick
}
