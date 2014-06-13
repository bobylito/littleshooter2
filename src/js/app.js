/** @jsx React.DOM */

var w = window;
var d = w.document;
var React = require('react/addons');
var _ = require('underscore');

var Messages = require('./Messages.js');

var Ship = require('./Ship');
var RocketLauncher = require('./RocketLauncher.js');

var GameScreen = React.createClass({
  getInitialState: function(){
    return {
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
    var msgsToSend = Messages.get();
    Messages.reset();
    var style = {
      width : this.props.width + "px",
      height: this.props.height+ "px"
    };
    var screen = {
      width : parseInt(this.props.width, 10),
      height: parseInt(this.props.height, 10)
    };
    return <div className="game" style={style}
                                 onKeyDown = { this.keyHandler.bind(this, true) }
                                 onKeyUp   = { this.keyHandler.bind(this, false) } tabIndex="1">
              <Ship inputState={this.state.input} messages={msgsToSend} screen={screen}/>
              <RocketLauncher inputState={this.state.input} messages={msgsToSend} screen={screen} />
           </div>;
  },
  tick : function(  ){
    var t = Date.now();
    requestAnimationFrame(this.tick);
    this.setState({
      input:{
        time : t,
        keys : this.state.input.keys
      }
    });
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
React.renderComponent( <GameScreen width="500" height="500" />, output);
