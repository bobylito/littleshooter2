/** @jsx React.DOM */
var React = require('react/addons');

var Score = React.createClass({
  render: function(){
    var score = this.props.score; 
    return <div className="score"> 
      <h2>Score</h2>
      <p>{score}</p>
    </div>;
  }
});

module.exports = Score;
