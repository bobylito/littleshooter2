/** @jsx React.DOM */

var React = require('react/addons');
var _ = require('underscore');

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
      top : ship.position[1] *
              (this.props.screen.height - this.state.height),
      left: ship.position[0] *
              (this.props.screen.width - this.state.width)
    };
    var cssClasses = ["ship"];
    var epsilon = 0.1;
    if(ship.speed[0] > epsilon) cssClasses.push("right");
    if(ship.speed[0] < -epsilon) cssClasses.push("left");
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
      previousT: input.time,
      lastFire : this.state.lastFire
    };

    if(input.keys.right)  { Messages.post( Messages.ID.SHIP_MOVE_RIGHT ) }
    if(input.keys.left)   { Messages.post( Messages.ID.SHIP_MOVE_LEFT  ) }
    if(input.keys.up)     { Messages.post( Messages.ID.SHIP_MOVE_UP    ) }
    if(input.keys.down)   { Messages.post( Messages.ID.SHIP_MOVE_DOWN  ) }

    if(input.keys.space)  {
      if( input.time > this.state.lastFire + 50 ) {
        var shipPos = world.player.ship.position.slice(0);
        Messages.post( Messages.ID.ROCKET_LAUNCH, {
          pos : shipPos
        } );
        newState.lastFire = input.time;
      }
    }

    this.setState(newState);
  },
});

module.exports = Ship;
