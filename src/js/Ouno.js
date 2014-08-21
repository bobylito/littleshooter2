/** @jsx React.DOM */
var React = require('react/addons');
var Ouno = React.createClass({
  render:function(){
    var model = this.props.model;
    var screen = this.props.screen;
    var style = {
      top : model.position[1] * screen.height,
      left: model.position[0] * screen.width
    }
    return <div className="ouno" style={style} ></div>
  }
});
module.exports = Ouno;
