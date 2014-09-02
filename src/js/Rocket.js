/** @jsx React.DOM */

var React = require('react/addons');
var _ = require('underscore');

var Messages = require('./Messages.js');

var Rocket = React.createClass({
  componentWillReceiveProps : function( next ){
    if(this.props.position[1] < -1) {
      Messages.post( Messages.ID.ROCKET_LOST, Messages.channelIDs.GAME, this.props.key);
    }
  },
  render : function(){
    var style = {
      top : this.props.position[1] * this.props.screen.height,
      left: (this.props.position[0] * this.props.screen.width) + 5
    };

    return <div style={style} className="rocket"/>;
  }
});

module.exports = Rocket;
