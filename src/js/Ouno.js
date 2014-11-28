/** @jsx React.DOM */
var React = require('react/addons');
var Ouno = React.createClass({
  render:function(){
    var model = this.props.model;
    var screen = this.props.screen;
    var style = {
      transform: this.transform(
        model.position[0] * screen.width,
        model.position[1] * screen.height)
    };
    return <div className="ouno positionable" style={style} ></div>;
  },
  transform: function(x, y){
    return "translate("+x+"px,"+y+"px)";
  }
});
module.exports = Ouno;
