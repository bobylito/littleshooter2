/** @jsx React.DOM */

var w = window;
var d = w.document;
var React = require('react/addons');
var _ = require('underscore');

var Messages = require('../Messages.js');

var models = require('../model/World.js');

var Ship = require('../Ship');
var RocketLauncher = require('../RocketLauncher');
var Horde = require('../Horde');
var WaveIntro = require('../WaveIntro');
var HUD = require('../HUD');

var GameScreen = React.createClass({
  getInitialState: function(){
    var now = Date.now();
    return {
      world : models.create( now ),
      input : {
        time : now,
        keys : {
          left  : false,
          right : false,
          up    : false,
          down  : false,
          space : false
        }
      }
    };
  },

  render : function(){
    var hordeOrIntro = this.state.world.currentWave ?
                <Horde world={this.state.world} screen={this.props.screen}/> :
                <WaveIntro inputState={this.state.input} world={this.state.world} screen={this.props.screen} />;
    return <div className="screen">
              {hordeOrIntro}
              <Ship inputState={this.state.input} ship={this.state.world.player.ship} screen={this.props.screen} />
              <RocketLauncher inputState={this.state.input} world={this.state.world} screen={this.props.screen} />
              <HUD world={this.state.world} screen={this.props.screen}/>
           </div>;
  },
  tick : function( newProps ){
    var nextWorld = models.tick(this.state.world, newProps.inputState.time);
    if(nextWorld.player.life < 1)
      Messages.post(Messages.ID.CHANGE_SCREEN, Messages.channelIDs.ROOT, nextWorld);
    this.setState({
      world: nextWorld,
      input: newProps.inputState
    });
  },
  componentWillReceiveProps : function( newProps ){
    this.tick( newProps );
  },
});

module.exports = GameScreen;
