/** @jsx React.DOM */
var React = require('react/addons');
var T = require('./Transform');
var Ouno = React.createClass({
  render:function(){
    var model = this.props.model;
    var screen = this.props.screen;
    var style = {
      transform: T.translate(
        model.position[0] * screen.width,
        model.position[1] * screen.height)
    };
    return <div className="ouno positionable" style={style} ></div>;
  }
});
module.exports = Ouno;
