/** @jsx React.DOM */
var React = require('react/addons');
var Ouno = require('./Ouno');
var Horde = React.createClass({
  render: function(){
    var self = this;
    var baddies = this.props.world.baddies.map(function(b){
      return <Ouno model={b} screen={self.props.screen}/>
    });
    return <div>
      {baddies}
    </div>
  }
});

module.exports = Horde;
