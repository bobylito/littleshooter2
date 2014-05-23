/** @jsx React.DOM */

(function(React, d, w){
  var Ship = React.createClass({
    getInitialState:function(){
      return {
        position:[0,0],
        velocity:[0,0],
        previousT : Date.now()
      };
    },
    render : function(){
      var style = {
        top : this.state.position[1],
        left: this.state.position[0]
      };
      return <div className='ship' style={style}/>;
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
        previousT: input.time
      };
      if(input.keys.right)  { newState.velocity[0] = v }
      if(input.keys.left)   { newState.velocity[0] = -v }
      if(input.keys.up)     { newState.velocity[1] = -v }
      if(input.keys.down)   { newState.velocity[1] = v }

      newState.velocity[0] = newState.velocity[0] / 2;
      newState.velocity[1] = newState.velocity[1] / 2;

      newState.position[0] += newState.velocity[0] * deltaT;
      newState.position[1] += newState.velocity[1] * deltaT;

      this.setState(newState);
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
    tick : function( t ){
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
    keyHandler : function(valueToSet, e){
      var newKeys = {};
      switch(e.keyCode){
        case 37 : newKeys.left  = valueToSet; break;
        case 38 : newKeys.up    = valueToSet; break;
        case 39 : newKeys.right = valueToSet; break;
        case 40 : newKeys.down  = valueToSet; break;
      }
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
