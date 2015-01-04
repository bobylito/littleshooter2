/** @jsx React.DOM */
var React = require('react/addons');
var _ = require('underscore');

var KillList = require('./KillList');
var Score = require('./Score');

var Victory = React.createClass({
  render : function(){
    if( this.props.score > 0 ){
      return <div className="wave-intro intro">
          <h1 className="impact">Victory!</h1>
          <KillList className="from-left" stats={this.props.stats}/>
          <Score className="fade-in" score={ this.props.score } />
          <p className="fade-in-then-blink">
            Press <span className="button">enter</span>
          </p>
        </div>;
    }
    else {
      return <div className="wave-intro intro">
          <h1 className="impact">Victory!</h1>
          <KillList className="from-left" stats={this.props.stats}/>
          <p className="fade-in-then-blink">
            Press <span className="button">enter</span>
          </p>
        </div>;
    }
  }
});

module.exports = Victory;
