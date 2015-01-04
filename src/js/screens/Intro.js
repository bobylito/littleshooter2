/** @jsx React.DOM */

var React = require('react/addons');
var Messages = require('../Messages.js');

var Sounds = require('../Sounds');

var Intro = React.createClass({
  render:function(){
    return <div className="intro">
      <h1 className="from-left">Little shooter</h1>
      <h2 className="from-left delay-1">
        Press <span className="button">RETURN</span>
      </h2>
      <div className="ship"></div>
    </div>;
  },
  componentWillReceiveProps:function(next){
    if(next.inputState.keys.enter){
      Sounds.sprites.play("validate"); 
      Messages.post(Messages.ID.CHANGE_SCREEN, Messages.channelIDs.ROOT);
    }
  }
});

module.exports = Intro;
