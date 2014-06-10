/** @jsx React.DOM */

var w = window;
var d = w.document;
var React = require('react/addons');
var _ = require('underscore');

var id = (function(){var i = 0; return function(){ i+=1; return i;}; })();
/**
 * Messages : { id : "id", val : "any type and not mandatory" }
 * */
var messages = [];
var messageIDs = {
  ROCKET_LOST : 0
}

var Rocket = React.createClass({
  getInitalState : function(){
    return {
      position : [0,0],
      startT : Date.now()
    };
  },
  componentWillMount: function(){
    this.setState({
      position : this.props.position,
      startT : Date.now()
    });
  },
  componentWillReceiveProps : function( next ){
    this.computeState(next)
  },
  computeState: function( props ){
    var delta = props.inputState.time - this.state.startT;
    var newState = {
      startT : props.inputState.time,
      position : [
        this.state.position[0],
        this.state.position[1] - (delta)
      ]
    }
    if(this.state.position[1] < -10) {
      messages.push({
        id  : messageIDs.ROCKET_LOST,
        val : this.props.key
      });
    }
    this.setState(newState);
  },
  render : function(){
    var style = {
      top : this.state.position[1],
      left: this.state.position[0]
    };

    return <div style={style} className="rocket"/>;
  }
});

var Ship = React.createClass({
  getInitialState:function(){
    return {
      position:[0,0],
      velocity:[0,0],
      previousT : Date.now(),
      rockets : [],
      lastFire : 0
    };
  },
  render : function(){
    var self = this;
    var style = {
      top : this.state.position[1],
      left: this.state.position[0]
    };
    var rockets = this.state.rockets.map(function(m){
      return self.transferPropsTo(
        <Rocket key={m.id} position={m.pos}/>
      );
    });
    var cssClasses = ["ship"];
    var epsilon = 0.1;
    if(this.state.velocity[0] > epsilon) cssClasses.push("right");
    if(this.state.velocity[0] < -epsilon) cssClasses.push("left");
    return <div className={ cssClasses.join(" ")} style={style}>
             {rockets}
           </div>;
  },
  componentWillReceiveProps:function( props ){
    this.updateState(props.inputState);
    props.message = this.handleMessages(props.messages);
  },
  updateState : function(input){
    var v = 1;
    var deltaT = input.time - this.state.previousT;
    var newState = {
      velocity : this.state.velocity.slice(0),
      position : this.state.position.slice(0),
      previousT: input.time,
      rockets : this.state.rockets,
      lastFire : this.state.lastFire
    };
    if(input.keys.right)  { newState.velocity[0] = v }
    if(input.keys.left)   { newState.velocity[0] = -v }
    if(input.keys.up)     { newState.velocity[1] = -v }
    if(input.keys.down)   { newState.velocity[1] = v }

    newState.velocity[0] = newState.velocity[0] / 2;
    newState.velocity[1] = newState.velocity[1] / 2;

    newState.position[0] = Math.min(Math.max(0,
          this.state.position[0] + newState.velocity[0] * deltaT),
        this.props.screen.width - 20);
    newState.position[1] = Math.min(Math.max(0,
          this.state.position[1] + newState.velocity[1] * deltaT),
        this.props.screen.height - 23);

    if(input.keys.space)  {
      if( input.time > this.state.lastFire + 50 ) {
        newState.rockets.push( {
          id : id(),
          pos : newState.position.slice(0)
        } );
        newState.lastFire = input.time;
      }
    }

    this.setState(newState);
  },
  handleMessages: function( messages ) {
    if( messages.length <= 0) return
    else {
      var msgs = _(messages).partition( function(m){
              return m.id === messageIDs.ROCKET_LOST;
          });
      var missingRocketIds = _(msgs[0]).chain().map(function(m){
              return m.val;
          });
      var remainingRockets = _.reject(this.state.rockets, function(r){
          return missingRocketIds.contains( r.id ).value();
      });
      this.setState( React.addons.update(this.state, {
        rockets : {$set : remainingRockets}
      }) );
      return msgs[1];
    }
  }
});

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
    var msgsToSend = messages;
    messages = [];
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
