/** @jsx React.DOM */
var React = require('react/addons');
var _ = require('underscore');

var HUD = React.createClass({
  render:function(){
    var player = this.props.world.player;
    var life = _.map( _.range(player.life), function(i){
      return <div className="ship" key={i}/>
    });
    return <div className="hud">
      <div className="points">{player.score}</div>
      <div className="life">{life}</div>
    </div>;
  },
  shouldComponentUpdate: function(nextProps){
    return this.props.world.player.life  != nextProps.world.player.life ||
           this.props.world.player.score != nextProps.world.player.score;
  }
});

module.exports = HUD
