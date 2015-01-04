/** @jsx React.DOM */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var _ = require('underscore');

var Messages = require('../Messages.js');
var Utils = require('../Utils.js');
var T = require('../Transform');

var id = Utils.idGenFactory();

var Starfield = React.createClass({
  render:function(){
    var messages     = Messages.get(Messages.channelIDs.FX);
    var starfieldIn  = !!messages[Messages.ID.STARFIELD_IN];
    var starfieldOut = !!messages[Messages.ID.STARFIELD_OUT];

    var className = "fx";
    if(starfieldIn) {
      className += " simple-fade-in"; 
    }
    else if(starfieldOut){
      className += " simple-fade-out";
    }

    var style1 = {
      "backgroundImage" : "url(" + this.state.bg1 + ")"
    };
    var style2 = {
      "backgroundImage" : "url(" + this.state.bg2 + ")"
    };
    var style3 = {
      "backgroundImage" : "url(" + this.state.bg3 + ")"
    };

    return <div className={className}>
      <div className="starfield stars l-1" style={style1}></div>
      <div className="starfield stars l-2" style={style2}></div>
      <div className="starfield stars l-3" style={style3}></div>
    </div>;
  },
  componentWillMount: function(){
    //Create image with canvas
    this.setState({
      bg1 : this.createStars(20),
      bg2 : this.createStars(50),
      bg3 : this.createStars(100)
    });
  },
  shouldComponentUpdate: function(){
    var messages = Messages.get(Messages.channelIDs.FX);
    return !!messages[Messages.ID.STARFIELD_IN] ||
           !!messages[Messages.ID.STARFIELD_OUT];
  },
  createStars : function(n){
    var c = document.createElement("canvas");
    c.width = this.props.screen.width;
    c.height = this.props.screen.height;
    var ctx = c.getContext("2d");
    ctx.fillStyle="#fff";
    for(var i = 0; i < n; i++){
      ctx.fillRect( Math.random() * c.width, Math.random() * c.height, 1, 1);
    }
    return c.toDataURL();
  }
});


module.exports = Starfield;
