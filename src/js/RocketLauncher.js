/** @jsx React.DOM */

var React = require('react/addons');
var _ = require('underscore');

var Rocket = require('./Rocket.js');

var RocketLauncher = React.createClass({
  getInitialState: function(){
    return {
      rockets: []
    };
  },
  render : function(){
    var self = this;
    var rockets = this.props.world.player.ship.rockets.map(function(r){
      return self.transferPropsTo(
        <Rocket key={r.id} position={r.position}/>
      );
    });
    return <div className="RocketLauncher">
             {rockets}
           </div>;
  },
  componentWillReceiveProps:function( props ){
  },
});

module.exports = RocketLauncher;
