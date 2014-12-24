/** @jsx React.DOM */

var w = window;
var d = w.document;
var React = require('react/addons');
var _ = require('underscore');

var Messages = require('./Messages.js');

var Intro = require('./screens/Intro.js');
var Game = require('./screens/Game.js');
var GameOver = require('./screens/GameOver.js');
var FX = require('./fx');

var SCREENS = {
  INTRO     : 0,
  GAME      : 1,
  GAME_OVER : 2
};

var GameApp = React.createClass({
  getInitialState: function(){
    return {
      currentScreen: 0,
      lastScreenData: {},
      input : {
        time : (Date.now()),
        keys : {
          left  : 0,
          right : 0,
          up    : 0,
          down  : 0,
          space : 0,
          enter : false,
        }
      }
    };
  },

  deltaTOrZero : function( currentT, keyValue ){
    if(keyValue === 0) return 0;
    else return currentT - keyValue;
  },
  render : function(){
    var currentT = this.state.input.time;
    var stateWithDeltaKeys = React.addons.update( this.state.input,
          {
            keys : { left  : { $set :this.deltaTOrZero(currentT, this.state.input.keys.left  ) },
                     right : { $set :this.deltaTOrZero(currentT, this.state.input.keys.right ) },
                     down  : { $set :this.deltaTOrZero(currentT, this.state.input.keys.down  ) },
                     up    : { $set :this.deltaTOrZero(currentT, this.state.input.keys.up    ) },
                     space : { $set :this.deltaTOrZero(currentT, this.state.input.keys.space ) } }
          }
        );
    var style = {
      width : this.props.width + "px",
      height: this.props.height+ "px"
    };
    var screen = {
      width : parseInt(this.props.width, 10),
      height: parseInt(this.props.height, 10)
    };
    var screenComponent;
    switch(this.state.currentScreen){
      case SCREENS.INTRO :
        screenComponent = <Intro screen={screen} inputState={stateWithDeltaKeys} lastScreenData={this.state.lastScreenData}/>;
        break;
      case SCREENS.GAME :
        screenComponent = <Game screen={screen} inputState={stateWithDeltaKeys} lastScreenData={this.state.lastScreenData}/>;
        break;
      case SCREENS.GAME_OVER:
        screenComponent = <GameOver screen={screen} inputState={stateWithDeltaKeys} lastScreenData={this.state.lastScreenData}/>;
        break;
      default : throw new Error("Inconsistent screen state : "+this.state.currentScreen);
    }
    var className = "game";
    if(!!Messages.get(Messages.channelIDs.FX)[Messages.ID.EXPLOSION]){
      className += " shake";
    }
    return <div className={className} style={style}
                                 onKeyDown = { this.keyHandler.bind(this, true) }
                                 onKeyUp   = { this.keyHandler.bind(this, false) } tabIndex="1">
              <FX inputState={this.state.input} screen={screen}/>
              {screenComponent}
           </div>;
  },
  tick : function(  ){
    var t = Date.now();
    requestAnimationFrame(this.tick);
    this.checkMessages();
    this.setState({
      input:{
        time : t,
        keys : this.state.input.keys
      }
    });
  },
  checkMessages : function(){
    var messages = Messages.get(Messages.channelIDs.ROOT);
    if(messages[Messages.ID.CHANGE_SCREEN] &&
        messages[Messages.ID.CHANGE_SCREEN].length > 0) {
          var msg = messages[Messages.ID.CHANGE_SCREEN];
          var nextScreen = this.state.currentScreen < 2 ? this.state.currentScreen + 1 : 0;
          Messages.reset();
          this.setState({currentScreen: nextScreen,
                         lastScreenData: msg[0].val,
                         input : {
                           time : (this.state.input.time),
                           keys : {
                             left  : 0,
                             right : 0,
                             up    : 0,
                             down  : 0,
                             space : 0,
                             enter : false}}
                         });
        }
  },
  componentWillReceiveProps : function(props){
  },
  componentWillMount : function(){
    requestAnimationFrame( this.tick );
  },
  componentDidMount : function(){
    this.getDOMNode().focus();
  },
  newValueForKey: function(valueToSet, currentTime, keyName){
    var currentKeyValue = this.state.input.keys[keyName];
    if(valueToSet && currentKeyValue === 0){
      return currentTime;
    }
    else if(!valueToSet) {
      return 0;
    }
    return currentKeyValue;
  },
  keyHandler : function(valueToSet, e){
    var newKeys = {
      left  : this.state.input.keys.left,
      right : this.state.input.keys.right,
      up    : this.state.input.keys.up,
      down  : this.state.input.keys.down,
      space : this.state.input.keys.space,
      enter : this.state.input.keys.enter
    };

    if(e.keyCode === 37) newKeys.left  = this.newValueForKey(valueToSet, this.state.input.time, "left");
    if(e.keyCode === 38) newKeys.up    = this.newValueForKey(valueToSet, this.state.input.time, "up");
    if(e.keyCode === 39) newKeys.right = this.newValueForKey(valueToSet, this.state.input.time, "right");
    if(e.keyCode === 40) newKeys.down  = this.newValueForKey(valueToSet, this.state.input.time, "down");
    if(e.keyCode === 32) newKeys.space = this.newValueForKey(valueToSet, this.state.input.time, "space");
    if(e.keyCode === 13) newKeys.enter = valueToSet;

    this.setState({
      input:{
        time : this.state.input.time,
        keys : newKeys
      }
    }, function unableAutoFire(){
      var newState = React.addons.update( this.state, {
        input: { keys: { enter : { $set : false }}}
      });
      this.setState(newState);
    });
  }
});

var output = d.getElementById("main");
React.render( <GameApp width="500" height="500" />, output);
