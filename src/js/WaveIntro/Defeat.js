/** @jsx React.DOM */
var React = require('react/addons');
var _ = require('underscore');

var Defeat = React.createClass({
  render: function(){
    return <div className="wave-intro intro">
      <h1>DEFEAT!</h1>
      <p>Earth was not able defend itself from the ennemies <strong>you</strong> let go</p>
      <p>Press <span className="button">enter</span> to go back in time and fix this.</p>
    </div>;
  }
});

module.exports=Defeat;
