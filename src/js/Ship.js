/** @jsx React.DOM */

var React = require('react/addons');
var _ = require('underscore');

var Messages = require('./Messages.js');

var Ship = React.createClass({
  getInitialState:function(){
    return {
      position:[0,0],
      velocity:[0,0],
      height : 23,
      width : 20,
      previousT : Date.now(),
      lastFire : 0
    };
  },
  render : function(){
    var self = this;
    var style = {
      top : this.props.world.player.ship.position[1] *
              (this.props.screen.height - this.state.height),
      left: this.props.world.player.ship.position[0] *
              (this.props.screen.width - this.state.width)
    };
    var cssClasses = ["ship"];
    var epsilon = 0.1;
    if(this.state.velocity[0] > epsilon) cssClasses.push("right");
    if(this.state.velocity[0] < -epsilon) cssClasses.push("left");
    return <div className={ cssClasses.join(" ")} style={style}></div>;
  },
  componentWillReceiveProps:function( props ){
    this.updateState(props.inputState);
  },
  updateState : function(input){
    var v = 1;
    var deltaT = input.time - this.state.previousT;
    var newState = {
      velocity : this.state.velocity.slice(0),
      position : this.state.position.slice(0),
      previousT: input.time,
      lastFire : this.state.lastFire
    };

    if(input.keys.right)  { Messages.post( Messages.ID.SHIP_MOVE_RIGHT ) }
    if(input.keys.left)   { Messages.post( Messages.ID.SHIP_MOVE_LEFT  ) }
    if(input.keys.up)     { Messages.post( Messages.ID.SHIP_MOVE_UP    ) }
    if(input.keys.down)   { Messages.post( Messages.ID.SHIP_MOVE_DOWN  ) }

    if(input.keys.space)  {
      if( input.time > this.state.lastFire + 50 ) {
        var shipPos = newState.position.slice(0);
        shipPos[0] += 10;
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
