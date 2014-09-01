/** @jsx React.DOM */

var w = window;
var d = w.document;
var React = require('react/addons');
var _ = require('underscore');

var Messages = require('../Messages.js');

var models = require('../model/World.js');

var Ship = require('../Ship');
var RocketLauncher = require('../RocketLauncher.js');
var Horde = require('../Horde');
var HUD = require('../HUD');

var GameScreen = React.createClass({
  getInitialState: function(){
    return {
      world : models.create(),
      input : {
        time : (Date.now()),
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
    var style = {
      width : this.props.screen.width + "px",
      height: this.props.screen.height+ "px"
    };
    return <div>
              <Ship inputState={this.state.input} world={this.state.world} screen={this.props.screen}/>
              <RocketLauncher inputState={this.state.input} world={this.state.world} screen={this.props.screen} />
              <Horde world={this.state.world} screen={this.props.screen}/>
              <HUD world={this.state.world} screen={this.props.screen}/>
           </div>;
  },
  tick : function( newProps ){
    this.setState({
      world: models.tick(this.state.world),
      input: newProps.inputState
    });
  },
  componentWillReceiveProps : function( newProps ){
    this.tick( newProps );
  },
});

module.exports = GameScreen;
