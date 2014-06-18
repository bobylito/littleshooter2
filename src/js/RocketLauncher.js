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
    var launchMsgs = messages[Messages.ID.ROCKET_LAUNCH] || [];
    var lostMsgs   = messages[Messages.ID.ROCKET_LOST] || [];

    if( launchMsgs.length === 0 && lostMsgs.length === 0) return messages;
    else {
      var missingRocketIds = _(lostMsgs).chain().map(function(m){
        return m.val;
      });
      var remainingRockets = _.reject(this.state.rockets, function(r){
        return missingRocketIds.contains( r.id ).value();
      });
      var newRockets = _.map(launchMsgs, function(msg){
        var rocketPosition = [ msg.val.pos[0] + 4, msg.val.pos[1] + 2];
        return {
          id: id(),
          pos: rocketPosition
        };
      });
      this.setState( React.addons.update(this.state, {
        rockets : {$set : remainingRockets.concat(newRockets)}
      }) );
    }
  }
});

module.exports = RocketLauncher;
