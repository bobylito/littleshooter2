/** @jsx React.DOM */

(function(React, d, w){
  var Ship = React.createClass({
    getInitialState:function(){
      return {position:[0,0]};
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
      var newState = {
        position : this.state.position.slice(0)
      };
      if(input.keys.right){ newState.position[0] += 1 }
      if(input.keys.left){ newState.position[0] -= 1 }
      if(input.keys.up){ newState.position[1] -= 1 }
      if(input.keys.down){ newState.position[1] += 1 }
      this.setState(newState);
    }
  });

  var GameScreen = React.createClass({
    getInitialState: function(){
      return {
        input : {
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
      return <div className="game" onKeyDown={this.keyDownHandler} onKeyUp={this.keyUpHandler} tabIndex="1">
                <Ship inputState={this.state.input}/>
             </div>
    },

    keyDownHandler : function(e){
      var newKeys = {};
      switch(e.keyCode){
        case 37 :
          newKeys.left = true;
          break;
        case 39 :
          newKeys.right= true;
          break;
      }
      this.setState({
        input:{
          keys:newKeys
        }
      });
    },

    keyUpHandler : function(e){
      var newKeys = {};
      switch(e.keyCode){
        case 37 : newKeys.left = false ;break
        case 39 : newKeys.right= false ;break
      }
      this.setState({
        input:{
          keys:newKeys
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
