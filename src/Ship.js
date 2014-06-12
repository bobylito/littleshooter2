/** @jsx React.DOM */

var React = require('react/addons');
var _ = require('underscore');

var Rocket = require('./Rocket.js');
var Messages = require('./Messages.js');

var id = (function(){var i = 0; return function(){ i+=1; return i;}; })();

var Ship = React.createClass({
  getInitialState:function(){
    return {
      position:[0,0],
      velocity:[0,0],
      previousT : Date.now(),
      rockets : [],
      lastFire : 0
    };
  },
  render : function(){
    var self = this;
    var style = {
      top : this.state.position[1],
      left: this.state.position[0]
    };
    var rockets = this.state.rockets.map(function(m){
      return self.transferPropsTo(
        <Rocket key={m.id} position={m.pos}/>
      );
    });
    var cssClasses = ["ship"];
    var epsilon = 0.1;
    if(this.state.velocity[0] > epsilon) cssClasses.push("right");
    if(this.state.velocity[0] < -epsilon) cssClasses.push("left");
    return <div className={ cssClasses.join(" ")} style={style}>
             {rockets}
           </div>;
  },
  componentWillReceiveProps:function( props ){
    this.updateState(props.inputState);
    props.message = this.handleMessages(props.messages);
  },
  updateState : function(input){
    var v = 1;
    var deltaT = input.time - this.state.previousT;
    var newState = {
      velocity : this.state.velocity.slice(0),
      position : this.state.position.slice(0),
      previousT: input.time,
      rockets : this.state.rockets,
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
        newState.rockets.push( {
          id : id(),
          pos : newState.position.slice(0)
        } );
        newState.lastFire = input.time;
      }
    }

    this.setState(newState);
  },
  handleMessages: function( messages ) {
    if( messages.length <= 0) return
    else {
      var msgs = _(messages).partition( function(m){
              return m.id === Messages.ID.ROCKET_LOST;
          });
      var missingRocketIds = _(msgs[0]).chain().map(function(m){
              return m.val;
          });
      var remainingRockets = _.reject(this.state.rockets, function(r){
          return missingRocketIds.contains( r.id ).value();
      });
      this.setState( React.addons.update(this.state, {
        rockets : {$set : remainingRockets}
      }) );
      return msgs[1];
    }
  }
});

module.exports = Ship;
