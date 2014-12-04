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
    if(model.flash){
      return <div className="ouno positionable flash" style={style} ></div>;
    }
    else {
      return <div className="ouno positionable" style={style} ></div>;
    }
  },
  componentWillReceiveProps : function(props){
    
  }
});
module.exports = Ouno;
