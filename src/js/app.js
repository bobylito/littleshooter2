/** @jsx React.DOM */

var w = window;
var d = w.document;
var React = require('react/addons');
var _ = require('underscore');

var Messages = require('./Messages.js');

var Intro = require('./screens/Intro.js');
var Game = require('./screens/Game.js');
var GameOver = require('./screens/GameOver.js');

var SCREENS = {
  INTRO     : 0,
  GAME      : 1,
  GAME_OVER : 2
};

var GameApp = React.createClass({
  getInitialState: function(){
    return {
      currentScreen: 0,
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
      width : this.props.width + "px",
      height: this.props.height+ "px"
    };
    var screen = {
      width : parseInt(this.props.width, 10),
      height: parseInt(this.props.height, 10)
    };
    var screenComponent;
    switch(this.state.currentScreen){
      case SCREENS.INTRO    :
        screenComponent = <Intro screen={screen} inputState={this.state.input}/>;
        break;
      case SCREENS.GAME     :
        screenComponent = <Game screen={screen} inputState={this.state.input}/>;
        break;
      case SCREENS.GAME_OVER: 
        screenComponent = <GameOver screen={screen} inputState={this.state.input}/>;
        break;
      default : throw new Error("Inconsistent screen state : "+this.state.currentScreen);
    }
    return <div className="game" style={style}
                                 onKeyDown = { this.keyHandler.bind(this, true) }
                                 onKeyUp   = { this.keyHandler.bind(this, false) } tabIndex="1">
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
          console.log(msg);
          var nextScreen = this.state.currentScreen < 2 ? this.state.currentScreen + 1 : 0;  
          this.setState({currentScreen: nextScreen});
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
  keyHandler : function(valueToSet, e){
    var newKeys = {
      left  : this.state.input.keys.left,
      right : this.state.input.keys.right,
      up    : this.state.input.keys.up,
      down  : this.state.input.keys.down,
      space : this.state.input.keys.space
    };

    if(e.keyCode === 37) newKeys.left  = valueToSet;
    if(e.keyCode === 38) newKeys.up    = valueToSet;
    if(e.keyCode === 39) newKeys.right = valueToSet;
    if(e.keyCode === 40) newKeys.down  = valueToSet;
    if(e.keyCode === 32) newKeys.space = valueToSet;

    this.setState({
      input:{
        time : this.state.input.time,
        keys : newKeys
      }
    });
  }
});

var output = d.getElementById("main");
React.renderComponent( <GameApp width="500" height="500" />, output);
