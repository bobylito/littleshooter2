/** @jsx React.DOM */
var React = require('react/addons');
var _ = require('underscore');

var KillList = React.createClass( {
  render: function(){
    var i = 0;
    var currentWave = this.props.stats.currentWave;
    var killList    = _.map(currentWave.kill, function(timestamps, monsterType){
      var monsterClass = "monster "+monsterType;
      return <li key={monsterType} className={ this.props.className + " delay-" + ++i}>
        <span className={monsterClass}/> x {timestamps.length}
      </li>
    }, this);
    var perfectText = _.isEmpty(currentWave.miss) ?
      <div className={"perfect impact delay-"+ (i+1) }>Perfect</div> : undefined;
    return <div className="kill-list">
      <h2 className={this.props.className}>Enemies killed</h2>
      <ul>
        {killList}
      </ul>
      {perfectText}
    </div>;
  }
} );

module.exports = KillList;
