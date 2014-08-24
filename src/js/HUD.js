/** @jsx React.DOM */
var React = require('react/addons');

var HUD = React.createClass({
  render:function(){
    var player = this.props.world.player;

    return <div className="hud">
      <div className="points">
        {player.score}
      </div>
    </div>;
  }
});

module.exports = HUD
