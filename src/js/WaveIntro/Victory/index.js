/** @jsx React.DOM */
var React = require('react/addons');
var _ = require('underscore');

var KillList = require('./KillList');
var Score = require('./Score');

var Victory = React.createClass({
  render : function(){
    return <div className="wave-intro intro">
        <h1>Victory!</h1>
        <KillList stats={this.props.stats}/>
        <Score score={ this.props.score } />
        <p>
          Press <span className="button">enter</span>
        </p>
      </div>;
  }
});

module.exports = Victory;
