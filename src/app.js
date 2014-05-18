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
    }
  });

  var output = d.getElementById("game");
  React.renderComponent( <Ship/>, output);
})(
    React,
    document,
    window
  );
