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
    if( !!this.state.world.currentWave ){
      return <div className="screen">
               <Horde world={this.state.world} screen={this.props.screen}/> :
               <Ship inputState={this.state.input} ship={this.state.world.ship}
                     baddies={this.state.world.baddies} screen={this.props.screen} />
               <RocketLauncher inputState={this.state.input} world={this.state.world}
                               screen={this.props.screen} />
               <HUD player={this.state.world.player} screen={this.props.screen}
                    world={this.state.world}/>
             </div>;
    }
    else {
      return <div className="screen">
                <WaveIntro inputState={this.state.input} world={this.state.world} screen={this.props.screen} />;
                <Ship inputState={this.state.input} ship={this.state.world.ship}
                      baddies={this.state.world.baddies} screen={this.props.screen} />
                <RocketLauncher inputState={this.state.input} world={this.state.world}
                                screen={this.props.screen} />
             </div>;
    }
  },
  tick : function( newProps ){
    var nextWorld = models.tick(this.state.world, newProps.inputState.time);
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
