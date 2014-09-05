/** @jsx React.DOM */

var React = require('react/addons');
var Messages = require('../Messages.js');

var GameOver = React.createClass({
  render:function(){
    var world = this.props.world;
    return <div className="intro">
      <h1>Game over</h1>
      <h2>Score : {world.player.score}</h2>
      <h2>Rank : </h2>
      <p>Press space to restart </p>
    </div>;
  },
  componentWillReceiveProps:function(next){
    if(next.inputState.keys.space) Messages.post(Messages.ID.CHANGE_SCREEN, Messages.channelIDs.ROOT);
  }
});

module.exports = GameOver;
