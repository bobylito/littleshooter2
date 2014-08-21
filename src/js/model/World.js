var Messages = require('../Messages.js');

//World
var World = function( tick ){
  this.player = new Player;
  this.baddies = [];
  this.tick = tick;
  this.firstTick = tick;
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
}

Ship.prototype = {
  left  : function(){ this.speed[0] -= 0.0003; },
  right : function(){ this.speed[0] += 0.0003; },
  up    : function(){
    this.speed[1] -= 0.0003;
  },
  down  : function(){ this.speed[1] += 0.0003; },
  move  : function( deltaT ){
    this.speed[0] *= 0.8;
    this.speed[1] *= 0.8;
    this.position[0] = Math.min(Math.max(0,
          this.position[0] + this.speed[0] * deltaT), 1);
    this.position[1] = Math.min(Math.max(0,
          this.position[1] + this.speed[1] * deltaT), 1);
  }
};
//Baddie
var Ouno = function(){
  this.position = [0.5, -0.2];
  this.speed = [0, 0.0001];
}

Ouno.prototype = {
  move: function(deltaT){
    this.position[0] += this.speed[0] * deltaT;
    this.position[1] += this.speed[1] * deltaT;
    if( this.position[1] > 1.2) this.position[1] = -0.2;
  }
}

var worldTick = function(messages, world){
  if(!!messages[Messages.ID.SHIP_MOVE_UP]) world.player.ship.up();
  if(!!messages[Messages.ID.SHIP_MOVE_DOWN]) world.player.ship.down();
  if(!!messages[Messages.ID.SHIP_MOVE_LEFT]) world.player.ship.left();
  if(!!messages[Messages.ID.SHIP_MOVE_RIGHT]) world.player.ship.right();
  world.player.ship.move(30);
  if(world.baddies.length === 0) world.baddies.push(new Ouno());
  world.baddies.forEach(function(b){
    b.move(30);
  });
  return world;
}

var createWorld = function(){
  return new World();
}

module.exports = {
  create : createWorld,
  tick : worldTick
}
