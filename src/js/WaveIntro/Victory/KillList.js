/** @jsx React.DOM */
var React = require('react/addons');
var _ = require('underscore');

var KillList = React.createClass( {
  render: function(){
    var currentWave = this.props.stats.currentWave;
    var killList = _.map(currentWave.kill, function(timestamps, monsterType){
      var monsterClass = "monster "+monsterType;
      return <li key={monsterType}>
        <span className={monsterClass}/> x {timestamps.length}
      </li>
    }, this);
    return <div className="kill-list">
      <h2>Ennemies killed</h2>
      <ul>
        {killList}
      </ul>
    </div>;
  }
} );

module.exports = KillList;
