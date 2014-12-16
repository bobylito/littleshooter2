/** @jsx React.DOM */

var React = require('react/addons');
var _ = require('underscore');
var T = require('./Transform');

var Messages = require('./Messages.js');

var Rocket = React.createClass({
  componentWillReceiveProps : function( next ){
  },
  render : function(){
    var screen = this.props.screen;
    var rocket = this.props.rocket;
    var style = {
      transform: T.translate(
        rocket.position[0] * screen.width,
        rocket.position[1] * screen.height)
    };
    var className = "rocket positionable " + this.props.rocket.PRFX_ID;

    return <div style={style} className={className}/>;
  }
});

module.exports = Rocket;
