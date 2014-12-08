/** @jsx React.DOM */

var React = require('react/addons');
var _ = require('underscore');
var T = require('./Transform');

var Messages = require('./Messages.js');

var Rocket = React.createClass({
  componentWillReceiveProps : function( next ){
  },
  render : function(){
    var style = {
      transform: T.translate(
        this.props.position[0] * this.props.screen.width  - 3,
        this.props.position[1] * this.props.screen.height - 10)
    };

    return <div style={style} className="rocket positionable"/>;
  }
});

module.exports = Rocket;
