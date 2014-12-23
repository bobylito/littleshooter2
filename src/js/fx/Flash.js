/** @jsx React.DOM */
var React = require('react/addons');
var _ = require('underscore');

var Messages = require('../Messages.js');
var Utils = require('../Utils.js');
var T = require('../Transform');

var id = Utils.idGenFactory();

var Flash = React.createClass({
  getInitialState:function(){
    return {
      isFlashing: false
    };
  },
  render : function(){
    if(this.state.isFlashing)
      return <div className="fx flash"></div>;
    else
      return <div className="fx"></div>;
  },
  componentWillReceiveProps:function(props){
    var now = props.inputState.time;
    var msg = Messages.get(Messages.channelIDs.FX)[Messages.ID.FLASH] || [];
    if( !_.isEmpty(msg) ) {
      var self = this;
      this.setState({isFlashing: true});
      setTimeout( function(){
        self.setState({isFlashing: false});
      }, 30);
    }
  }
});

module.exports = Flash;
