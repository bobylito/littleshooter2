/** @jsx React.DOM */

var React = require('react/addons');
var Messages = require('../Messages.js');

var GameOver = React.createClass({
  render:function(){
    var world = this.props.lastScreenData;
    return <div className="intro">
      <h1>Game over</h1>
      <p>Score : {world.player.score}</p>
      <p>Rank : </p>
      <h2>
      Press <span className="button">return</span>
      </h2>
    </div>;
  },
  componentWillReceiveProps:function(next){
    if(next.inputState.keys.enter) Messages.post(Messages.ID.CHANGE_SCREEN, Messages.channelIDs.ROOT);
  }
});

module.exports = GameOver;
