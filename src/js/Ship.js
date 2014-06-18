/** @jsx React.DOM */

var React = require('react/addons');
var _ = require('underscore');

var Messages = require('./Messages.js');

var Ship = React.createClass({
  getInitialState:function(){
    return {
      position:[0,0],
      velocity:[0,0],
      previousT : Date.now(),
      lastFire : 0
    };
  },
  render : function(){
    var self = this;
    var style = {
      top : this.state.position[1],
      left: this.state.position[0]
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
    if(input.keys.right)  { newState.velocity[0] = v }
    if(input.keys.left)   { newState.velocity[0] = -v }
    if(input.keys.up)     { newState.velocity[1] = -v }
    if(input.keys.down)   { newState.velocity[1] = v }

    newState.velocity[0] = newState.velocity[0] * 0.9;
    newState.velocity[1] = newState.velocity[1] * 0.9;

    newState.position[0] = Math.min(Math.max(0,
          this.state.position[0] + newState.velocity[0] * deltaT),
        this.props.screen.width - 20);
    newState.position[1] = Math.min(Math.max(0,
          this.state.position[1] + newState.velocity[1] * deltaT),
        this.props.screen.height - 23);

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
