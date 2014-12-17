/** @jsx React.DOM */

var React = require('react/addons');
var _ = require('underscore');

var T = require('./Transform');
var Messages = require('./Messages.js');

var Ship = React.createClass({
  getInitialState:function(){
    return {
      lastFire : 0
    };
  },
  render : function(){
    var self = this;
    var style = {
      transform : T.translate( 
          ship.position[0] * (this.props.screen.width),
          ship.position[1] * (this.props.screen.height))};
    var cssClasses = ["ship", "positionable"];

    if(ship.isInvincible) cssClasses.push("blink");

    return <div className={ cssClasses.join(" ")} style={style}></div>;
  },
  shouldComponentUpdate: function(nextProps){
    //It should work but it won't since the model is not immutable
    var currentShip = this.props.world.player.ship;
    var nextShip = nextProps.world.player.ship;
    return (currentShip.position[0] != nextShip.position[0] ||
           currentShip.position[1] != nextShip.position[1]);
  },
  componentWillReceiveProps:function( props ){
    this.updateState(props.inputState, props.world);
  },
  updateState : function(input, world){
    var ship = this.props.world.player.ship;

    if(input.keys.right)  { Messages.post( Messages.ID.SHIP_MOVE_RIGHT, Messages.channelIDs.GAME, input.keys.right) }
    if(input.keys.left)   { Messages.post( Messages.ID.SHIP_MOVE_LEFT , Messages.channelIDs.GAME, input.keys.left) }
    if(input.keys.up)     { Messages.post( Messages.ID.SHIP_MOVE_UP   , Messages.channelIDs.GAME, input.keys.up) }
    if(input.keys.down)   { Messages.post( Messages.ID.SHIP_MOVE_DOWN , Messages.channelIDs.GAME, input.keys.down) }

    if(input.keys.space)  {
      if( input.time > this.state.lastFire + 50 && !ship.isInvincible) {
        var ship    = world.player.ship;
        var shipPos = ship.position;
        Messages.post(
          Messages.ID.ROCKET_LAUNCH,
          Messages.channelIDs.GAME,
          { pos : [
              shipPos[0] + ship.size[0] / 2,
              shipPos[1]  
            ]
          }
        );
        
        this.setState({
          lastFire: input.time
        });
      }
    }

  },
});

module.exports = Ship;
