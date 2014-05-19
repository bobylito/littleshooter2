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
      var v = 5;
      var newState = {
        position : this.state.position.slice(0)
      };
      if(input.keys.right){ newState.position[0] += v }
      if(input.keys.left){ newState.position[0] -= v }
      if(input.keys.up){ newState.position[1] -= v }
      if(input.keys.down){ newState.position[1] += v }
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
      return <div className="game" onKeyDown = { this.keyHandler.bind(this, true) }
                                   onKeyUp   = { this.keyHandler.bind(this, false) } tabIndex="1">
                <Ship inputState={this.state.input}/>
             </div>
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
        input:{ keys:newKeys }
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
