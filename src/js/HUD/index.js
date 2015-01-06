/** @jsx React.DOM */
var React = require('react/addons');
var _ = require('underscore');

var Gauge = require('./Gauge');

var HUD = React.createClass({
  render:function(){
    var player = this.props.player;
    var dayNumber = this.props.world.waveManager.currentWave + 1;
    var life = _.map( _.range(player.life), function(i){
      return <div className="ship" key={i}/>
    });
    return <div className="hud simple-fade-in">
      <div className="points">{player.score}</div>
      <Gauge amount={player.getWeaponEnergyRatio()} label="power"/>
      <div className="life">{life}</div>
      <div className="day">Day {dayNumber}</div>
    </div>;
  },
  shouldComponentUpdate: function(nextProps){
    return this.props.player.life         != nextProps.player.life  ||
           this.props.player.score        != nextProps.player.score ||
           this.props.player.weaponEnergy != nextProps.player.weaponEnergy;
  }
});

module.exports = HUD
