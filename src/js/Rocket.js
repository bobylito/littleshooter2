/** @jsx React.DOM */

var React = require('react/addons');
var _ = require('underscore');

var Messages = require('./Messages.js');

var Rocket = React.createClass({
  getInitialState : function(){
    return {
      position : [0,0],
      startT : Date.now()
    };
  },
  componentWillMount: function(){
    this.setState({
      position : this.props.position,
      startT : Date.now()
    });
  },
  componentWillReceiveProps : function( next ){
    this.computeState(next)
  },
  computeState: function( props ){
    var delta = props.inputState.time - this.state.startT;
    var newState = {
      startT : props.inputState.time,
      position : [
        this.state.position[0],
        this.state.position[1] - (delta)
      ]
    }
    if(this.state.position[1] < -10) {
      Messages.post( Messages.ID.ROCKET_LOST, this.props.key);
    }
    this.setState(newState);
  },
  render : function(){
    var style = {
      top : this.state.position[1],
      left: this.state.position[0]
    };

    return <div style={style} className="rocket"/>;
  }
});

module.exports = Rocket;
