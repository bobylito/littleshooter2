var Messages = require('../Messages.js');
var _ = require('underscore');

var Ship    = require('./Ship');
var Baddies = require('./Baddies');
var Waves   = require('./Waves');
var Rocket  = require('./Rocket');
var Stats   = require('./Stats');
var utils   = require('../Utils.js');

var id = utils.idGenFactory();

//World
var World = function( timestamp ){
  this.player         = new Player;
  this.baddies        = [];
  this.waveManager    = new Waves.WavesManager();
  this.currentWave    = null;
  this.timestamp      = timestamp;
  this.firstTimestamp = timestamp;
  this.stats          = new Stats( timestamp );
};

//Player
var Player = function(){
  this.score = 0;
  this.life = 3;
  this.ship = new Ship();
}

var handleMessages = function(messages, world, nextTimestamp){
  if(!!messages[Messages.ID.PLAYER_LOSE]) world.player.life--;

  //Wave trigger
  if(!!messages[Messages.ID.START_NEXT_WAVE]){
    var nextWaveNumber = messages[Messages.ID.START_NEXT_WAVE][0].val;
    world.currentWave  = world.waveManager.getNextWave( nextTimestamp, nextWaveNumber );
    world.stats.newWave( nextTimestamp );
  }

  //Ship movements
  if(!!messages[Messages.ID.SHIP_MOVE_UP])    world.player.ship.up(messages[Messages.ID.SHIP_MOVE_UP][0].val);
  if(!!messages[Messages.ID.SHIP_MOVE_DOWN])  world.player.ship.down(messages[Messages.ID.SHIP_MOVE_DOWN][0].val);
  if(!!messages[Messages.ID.SHIP_MOVE_LEFT])  world.player.ship.left(messages[Messages.ID.SHIP_MOVE_LEFT][0].val);
  if(!!messages[Messages.ID.SHIP_MOVE_RIGHT]) world.player.ship.right(messages[Messages.ID.SHIP_MOVE_RIGHT][0].val);

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
      var rocketPosition  = [msg.val.pos[0], msg.val.pos[1]];
      var rocketDirection = msg.val.dir ? [msg.val.dir[0], msg.val.dir[1]] : null;
      var isFromBaddies   = !!msg.val.isFromBaddies;
      if( isFromBaddies )
        return new Rocket.Rocket( rocketPosition, rocketDirection, true);
      else
        return new Rocket.Large( rocketPosition, rocketDirection, false);
    });
    world.player.ship.rockets = remainingRockets.concat(newRockets);
  }

  //Baddies
  var destroyedBaddies = messages[Messages.ID.BADDIE_DESTROYED] || [];
  var succeedingBaddies = messages[Messages.ID.BADDIE_WIN] || [];
  var allBaddiesToRemove = destroyedBaddies.concat(succeedingBaddies);

  if(allBaddiesToRemove.length > 0){
    var missingBaddiesID = _.chain(allBaddiesToRemove).map(function(b){
      return b.val;
    });
    var remainingBaddies = _.reject(world.baddies, function(b){
      return missingBaddiesID.contains( b.id ).value();
    });
    world.baddies = remainingBaddies;
  }

  // Ship destruction
  var destroyedShip = messages[Messages.ID.SHIP_DESTROYED] || [];
  if(destroyedShip.length > 0){
    world.stats.death( world.timestamp );
  }

  //Points
  var scoreMessages = messages[Messages.ID.UPDATE_SCORE] || [];
  if(scoreMessages.length > 0){
    world.player.score += scoreMessages[0].val;
  }
};

var worldTick = function(world, nextTimestamp){
  var deltaT = (nextTimestamp - world.timestamp);
  world.player.ship.tick(deltaT, world);
  if(!!world.currentWave && world.currentWave.hasNext()){
    var nextMonsters = world.currentWave.getNextMonsters(nextTimestamp);
    Array.prototype.push.apply( world.baddies, nextMonsters);
  }
  else if( world.baddies.length === 0) {
    world.currentWave = null;
  }

  world.baddies.forEach(function(b){
    b.tick(deltaT, world);
  });
  world.player.ship.rockets.forEach(function(r){
    r.tick(deltaT, world);
  });
  var c = testCollision(world.player.ship.rockets.filter( function(r){ return !r.isFromBaddies; }).concat(world.player.ship),
                        world.baddies.concat( world.player.ship.rockets.filter( function(r){ return r.isFromBaddies; })));

  _.chain(c).flatten().uniq().forEach(function(e){
    e.collide( world );
  });

  var messages = Messages.get(Messages.channelIDs.GAME);
  handleMessages(messages, world, nextTimestamp);
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
  return  (i1.position[0] +  i1.size[0]) > (i2.position[0] ) &&
          (i1.position[0] )              < (i2.position[0] + i2.size[0]) &&
          (i1.position[1] +  i1.size[1]) > (i2.position[1] ) &&
          (i1.position[1] )              < (i2.position[1] + i2.size[1])
}

var createWorld = function( timestamp ){
  return new World( timestamp );
}

module.exports = {
  create : createWorld,
  tick : worldTick
}
