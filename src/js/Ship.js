/** @jsx React.DOM */

var React = require('react/addons');
var _ = require('underscore');

var T = require('./Transform');
var Messages = require('./Messages.js');

var Ship = React.createClass({
  getInitialState:function(){
    return {
      height : 23,
      width : 20,
      previousT : Date.now(),
      lastFire : 0
    };
  },
  render : function(){
    var self = this;
    var ship = this.props.world.player.ship;
    var style = {
      transform : T.translate( 
          ship.position[0] * (this.props.screen.width),
          ship.position[1] * (this.props.screen.height))};
    var cssClasses = ["ship", "positionable"];

    var epsilon = 0.1;
    if(ship.speed[0] > epsilon) cssClasses.push("right");
    if(ship.speed[0] < -epsilon) cssClasses.push("left");

    if(ship.isInvincible) cssClasses.push("blink");

    return <div className={ cssClasses.join(" ")} style={style}></div>;
  },
  componentWillReceiveProps:function( props ){
    this.updateState(props.inputState, props.world);
  },
  updateState : function(input, world){
    var v = 1;
    var deltaT = input.time - this.state.previousT;
    var newState = {
      height    : this.state.height,
      width     : this.state.width,
      previousT : input.time,
      lastFire  : this.state.lastFire
    };

    if(input.keys.right)  { Messages.post( Messages.ID.SHIP_MOVE_RIGHT, Messages.channelIDs.GAME ) }
    if(input.keys.left)   { Messages.post( Messages.ID.SHIP_MOVE_LEFT , Messages.channelIDs.GAME ) }
    if(input.keys.up)     { Messages.post( Messages.ID.SHIP_MOVE_UP   , Messages.channelIDs.GAME ) }
    if(input.keys.down)   { Messages.post( Messages.ID.SHIP_MOVE_DOWN , Messages.channelIDs.GAME ) }

    if(input.keys.space)  {
      if( input.time > this.state.lastFire + 50 ) {
        var ship    = world.player.ship;
        var shipPos = ship.position;
        Messages.post(
          Messages.ID.ROCKET_LAUNCH,
          Messages.channelIDs.GAME,
          { pos : [
              shipPos[0] + ship.size[0] / 2,
              shipPos[1] + ship.size[1] 
            ]
          }
        );
        newState.lastFire = input.time;
      }
    }

    this.setState(newState);
  },
});

module.exports = Ship;
