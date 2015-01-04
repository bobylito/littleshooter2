var React = require('react/addons');
var _ = require('underscore');
var Messages = require('../Messages.js');

var Flash = React.createClass({
  propTypes : {
    className : React.PropTypes.string,
    messageId : React.PropTypes.oneOf( _.values( Messages.ID ) ),
    timeout   : React.PropTypes.number,
    inputState: React.PropTypes.object.isRequired
  },
  getDefaultProps : function(){
    return {
      className : "flash",
      messageId : Messages.ID.FLASH,
      timeout   : 30
    }; 
  },
  getInitialState:function(){
    return {
      isFlashing : 0
    };
  },
  render : function(){
    if( this.state.isFlashing ){
      var className = "fx " + this.props.className;
      return <div className={className}></div>;
    }
    else
      return <div className="fx"></div>;
  },
  componentWillReceiveProps:function(props){
    var now = props.inputState.time;
    var msg = Messages.get(Messages.channelIDs.FX)[ this.props.messageId ] || [];
    if( !_.isEmpty(msg) ) {
      this.setState({
        isFlashing : true
      });
      setTimeout( this.resetFlash, this.props.timeout);   
    }
  },
  resetFlash: function(){
    this.setState( {
      isFlashing : false
    } );
  }
});

module.exports = Flash;
