/** @jsx React.DOM */
var React = require('react/addons');
var _ = require('underscore');

var Messages = require('../Messages');
var Victory = require('./Victory');
var Defeat = require('./Defeat');

var Sounds = require('../Sounds');

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
      var waveNumber = this.props.world.waveManager.currentWave + (this.state.isVictory ? 1 : 0);
      var nextWave = this.props.world.waveManager.getWave(waveNumber);
      return <div className="day intro">
               <h1 className="from-bottom-fade-in">Day {waveNumber + 1}</h1>
               <p className="from-top-fade-in delay-1">{ nextWave.title }</p>
             </div>
    }
    else if(this.state.step === 2){
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
  shouldComponentUpdate: function(nextProps, nextState){
    return this.state.step != nextState.step;
  },
  componentWillReceiveProps: function(props){
    var step = this.state.step;
    if( step === 2 && props.inputState.keys.enter){
      Sounds.sprites.play("validate");
      if(this.state.isVictory)
        Messages.post(Messages.ID.START_NEXT_WAVE, Messages.channelIDs.GAME);
      else{
        Messages.post(Messages.ID.START_NEXT_WAVE,
                      Messages.channelIDs.GAME,
                      this.props.world.waveManager.currentWave);
      }
    }
    else if( this.state.step === 1 && this.props.inputState.time > this.state.timeout){
      this.setState({
        step : 2
      });
    }
    else if( step === 0 && props.inputState.keys.enter){
      Sounds.sprites.play("validate");
      if(this.props.world.player.life < 1)
        Messages.post(Messages.ID.CHANGE_SCREEN, Messages.channelIDs.ROOT, this.props.world);
      this.setState({
        step : 1
      });
    }
  },
  componentDidMount: function(){
    if( this.state.step === 1){
      this.setState({
        timeout : this.props.inputState.time + 3000
      });
    }
  },
  componentDidUpdate: function(){
    if( this.state.step === 1){
      this.setState({
        timeout : this.props.inputState.time + 3000
      });
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
        Messages.post(Messages.ID.PLAYER_LOSE, Messages.channelIDs.GAME);
        this.setState({
          score: 0,
          isVictory : false
        });
      }
    }
  }
});
module.exports=WaveIntro;
