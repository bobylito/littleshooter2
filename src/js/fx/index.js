/** @jsx React.DOM */
var React = require('react/addons');
var _     = require('underscore');

var ParticleSystem = require('./ParticleSystem');
var Flash          = require('./Flash');
var Starfield      = require('./Starfield');

var FX = React.createClass({
  render:function(){
    return <div className="fx">
      <Flash inputState={this.props.inputState} screen={this.props.screen}/>
      <ParticleSystem inputState={this.props.inputState} screen={this.props.screen}/>
      <Starfield inputState={this.props.inputState} screen={this.props.screen}/>
    </div>;
  }

});

module.exports=FX;
