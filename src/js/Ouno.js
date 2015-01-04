/** @jsx React.DOM */
var React = require('react/addons');
var T = require('./Transform');
var Sounds = require('./Sounds');

var Ouno = React.createClass({
  render:function(){
    var model = this.props.model;
    var screen = this.props.screen;
    var monsterType = model.PRFX_ID;
    var style = {
      transform: T.translate(
        model.position[0] * screen.width,
        model.position[1] * screen.height)
    };
    var classes = monsterType + " positionable"
    if(model.flash){
      classes += " flash"
    }
    return <div className={classes} style={style}></div>;
  },
  componentWillReceiveProps : function(props){
    if(this.props.model.flash) Sounds.sprites.play("hit");
  }
});
module.exports = Ouno;
