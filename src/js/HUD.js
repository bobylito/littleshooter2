/** @jsx React.DOM */
var React = require('react/addons');
var _ = require('underscore');

var HUD = React.createClass({
  render:function(){
    var player = this.props.world.player;
    var life = _.map( _.range(player.life), function(i){
      return <div className="ship"/>
    });
    return <div className="hud">
      <div className="points">{player.score}</div>
      <div className="life">{life}</div>
    </div>;
  }
});

module.exports = HUD
