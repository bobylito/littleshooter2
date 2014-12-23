/** @jsx React.DOM */
var React = require('react/addons');
var _ = require('underscore');

var HUD = React.createClass({
  render:function(){
    var player = this.props.player;
    var life = _.map( _.range(player.life), function(i){
      return <div className="ship" key={i}/>
    });
    return <div className="hud">
      <div className="points">{player.score}</div>
      <div className="life">{life}</div>
    </div>;
  },
  shouldComponentUpdate: function(nextProps){
    return this.props.player.life  != nextProps.player.life ||
           this.props.player.score != nextProps.player.score;
  }
});

module.exports = HUD
