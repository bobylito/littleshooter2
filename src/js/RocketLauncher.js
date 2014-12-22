/** @jsx React.DOM */

var React = require('react/addons');
var _ = require('underscore');

var Rocket = require('./Rocket.js');

var RocketLauncher = React.createClass({
  render : function(){
    var self = this;
    var rockets = this.props.world.rockets.map(function(r){
      return <Rocket key={r.id} rocket={r} screen={self.props.screen}/>
    });
    return <div className="rocket-launcher">
             {rockets}
           </div>;
  },
});

module.exports = RocketLauncher;
