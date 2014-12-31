var _ = require('underscore');

var Messages = require('../Messages.js');
var utils   = require('../Utils.js');

var Sounds = require('../Sounds');

var id = utils.idGenFactory();

var GenericRocket = function GenericRocket(config){
  //Let's consider the given position as the bottom center, with the the bottom
  this.size     = config.size;
  this.position = [
    config.position[0] - (config.size[0] / 2),
    config.position[1] - (config.size[1])
  ];
  this.speed    = config.speed;
  this.id       = this.PRFX_ID + id();
  this.isFromBaddies = !!(config.isFromBaddies);
};

GenericRocket.prototype = {
  constructor: GenericRocket,
  PRFX_ID : "rocket",
  tick    : function rocketTick( deltaT, world ){
    this.move( deltaT );
    if(this.position[1] < -0.2 || this.position[1] > 1.2 ||
       this.position[0] < -0.2 || this.position[0] > 1.2) {
      Messages.post( Messages.ID.ROCKET_LOST, Messages.channelIDs.GAME, this.id);
    }
  },
  move    : function rocketMove(deltaT){
    this.position[0] += this.speed[0] * deltaT;
    this.position[1] += this.speed[1] * deltaT;
  },
  collide : function rocketCollide(){
    Messages.post( Messages.ID.ROCKET_LOST, Messages.channelIDs.GAME, this.id);
  }
};

var Rocket = function Rocket(position, speed, isFromBaddies){
  GenericRocket.call(this, {
    position : position,
    speed    : (speed || [0, -0.001]),
    size     : [0.01, 0.02],
    isFromBaddies : !!isFromBaddies
  });
};

Rocket.prototype = Object.create(GenericRocket.prototype);
Rocket.prototype.constructor = GenericRocket;
Rocket.prototype.PRFX_ID = "n-rocket";
  
var Large = function LargeRocket(position, speed, isFromBaddies){
  GenericRocket.call(this, {
    position : position,
    speed    : (speed || [ (0.5 - Math.random())* -0.00005 , -0.001]),
    size     : [0.02, 0.02],
    isFromBaddies : !!isFromBaddies
  });
  Sounds.sprites.play('rocket');
};

Large.prototype = Object.create(GenericRocket.prototype);
Large.prototype.constructor = GenericRocket;
Large.prototype.PRFX_ID = "l-rocket";

module.exports = {
  Rocket : Rocket,
  Large  : Large
}
