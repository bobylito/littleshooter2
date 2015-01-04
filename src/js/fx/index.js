/** @jsx React.DOM */
var React = require('react/addons');
var _     = require('underscore');

var Messages = require('../Messages.js');

var ParticleSystem = require('./ParticleSystem');
var Flash          = require('./Flash');
var Starfield      = require('./Starfield');

var FX = React.createClass({
  render:function(){
    return <div className="fx">
      <Flash inputState={this.props.inputState} />
      <Flash inputState={this.props.inputState} messageId={Messages.ID.ALERT} className="alert" timeout={300}/>
      <ParticleSystem inputState={this.props.inputState} screen={this.props.screen}/>
      <Starfield inputState={this.props.inputState} screen={this.props.screen}/>
    </div>;
  },
  shouldComponentUpdate: function(){
    var messages = Messages.get(Messages.channelIDs.FX);
    return !_.isEmpty(messages);
  },
  componentDidUpdate: function(){
    Messages.reset( Messages.channelIDs.FX );
  }
});

module.exports=FX;
