/** @jsx React.DOM */
var React = require('react/addons');
var _ = require('underscore');

var Messages = require('../Messages');
var Victory = require('./Victory');
var Defeat = require('./Defeat');

var WaveIntro = React.createClass({
  getInitialState: function(){
    return {
      step : 0
    };
  },
  render:function(){
    if( this.state.step === 0){
      if(this.state.isVictory)
        return <Victory score={this.state.score} stats={this.props.world.stats} />;
      else
        return <Defeat stats={this.props.world.stats}/>;
    }
    else if(this.state.step === 1){
      return <div className="wave-intro intro">
          <h1 className="impact">Next Wave Incoming</h1>
          <p className="from-left">Kill at least <strong>3/4</strong> of the ennemies</p>
          <h2 className="impact delay-1">Get ready!</h2>
          <p className="fade-in-then-blink">
            Press <span className="button">enter</span>
          </p>
        </div>;
    }
  },
  shouldComponentUpdate: function(){
    return !!this.props.inputState.keys.enter;
  },
  componentWillReceiveProps: function(props){
    if(props.inputState.keys.enter) {
      var step = this.state.step;
      if( step > 0 ){
        if(this.state.isVictory)
          Messages.post(Messages.ID.START_NEXT_WAVE, Messages.channelIDs.GAME);
        else{
          Messages.post(Messages.ID.PLAYER_LOSE, Messages.channelIDs.GAME);
          Messages.post(Messages.ID.START_NEXT_WAVE,
                        Messages.channelIDs.GAME,
                        this.props.world.waveManager.currentWave);
        }
      }
      else {
        this.setState({
          step : (step + 1)
        });
      }
    }
  },
  componentWillMount: function(){
    var world = this.props.world;
    var currentWave = world.waveManager.getCurrentWave();
    if( !currentWave ){
      this.setState( {
        step : 1,
        isVictory : true
      });
    }
    else {
      var total  = this.props.world.waveManager.getTotalMonsterInCurrentWave();
      var killed = _.reduce( this.props.world.stats.currentWave.kill,
                            function(memo, monsters){
                              return memo + monsters.length;
                            }, 0);
      if( killed / total > 0.75) {
        var score  = total * 50;
        this.setState({
          score: score,
          isVictory : true
        });
        Messages.post(Messages.ID.UPDATE_SCORE, Messages.channelIDs.GAME, score);
      }
      else {
        this.setState({
          score: 0,
          isVictory : false
        });
      }
    }
  }
});
module.exports=WaveIntro;
