/** @jsx React.DOM */

(function(React, d, w){
  var id = (function(){var i = 0; return function(){ i+=1; return i;}; })();

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
      return <div className='ship' style={style}>
               {rockets}
             </div>;
    },
    componentWillReceiveProps:function( props ){
      this.updateState(props.inputState);
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

      newState.position[0] += newState.velocity[0] * deltaT;
      newState.position[1] += newState.velocity[1] * deltaT;

      if(input.keys.space)  {
        if( input.time > this.state.lastFire + 1000 ) {
          newState.rockets.push( {
            id : id(),
            pos : newState.position.slice(0)
          } );
          newState.lastFire = input.time;
        }
      }

      this.setState(newState);
    },
    setFireCooldown: function( t ) {
      this.state.canFire = false
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
      return <div className="game" onKeyDown = { this.keyHandler.bind(this, true) }
                                   onKeyUp   = { this.keyHandler.bind(this, false) } tabIndex="1">
                <Ship inputState={this.state.input}/>
             </div>
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
  React.renderComponent( <GameScreen/>, output);
})(
    React,
    document,
    window
  );
