/** @jsx React.DOM */

var React = require('react/addons');
var _ = require('underscore');

var Rocket = require('./Rocket.js');
var Messages = require('./Messages.js');

var id = (function(){var i = 0; return function(){ i+=1; return i;}; })();

var RocketLauncher = React.createClass({
  getInitialState: function(){
    return {
      rockets: []
    };
  },
  render : function(){
    var self = this;
    var rockets = this.state.rockets.map(function(r){
      return self.transferPropsTo(
        <Rocket key={r.id} position={r.pos}/>
      );
    });
    return <div className="RocketLauncher">
             {rockets}
           </div>;
  },
  componentWillReceiveProps:function( props ){
    this.handleMessages(props.messages);
  },
  handleMessages: function( messages ) {
    if( messages.length <= 0) return messages;
    else {
      var msgs = _(messages).partition( function(m){
        return m.id === Messages.ID.ROCKET_LOST || 
               m.id === Messages.ID.ROCKET_LAUNCH;
      });
      var rocketMsgs =  _(msgs[0]).partition(function(r){
        return r.id === Messages.ID.ROCKET_LOST;
      });
      var missingRocketIds = _(rocketMsgs[0]).chain().map(function(m){
        return m.val;
      });
      var remainingRockets = _.reject(this.state.rockets, function(r){
        return missingRocketIds.contains( r.id ).value();
      });
      var newRockets = _.map(rocketMsgs[1], function(msg){
        return {
          id: id(),
          pos: msg.val.pos
        };
      });
      this.setState( React.addons.update(this.state, {
        rockets : {$set : remainingRockets.concat(newRockets)}
      }) );
      return msgs[1];
    }
  }
});

module.exports = RocketLauncher;
