/** @jsx React.DOM */
var React = require('react/addons');
var _ = require('underscore');

var Messages = require('../Messages');

var KillList = require('./KillList');
var Score = require('./Score');

var WaveIntro = React.createClass({
  getInitialState: function(){
    return {
      step : 0
    };
  },
  render:function(){
    if( this.state.step === 0){
      var score = _.reduce( this.props.world.stats.currentWave.kill,
                            function(memo, monsters){
                              return memo + monsters.length * 50;
                            }, 0);

      return <div className="wave-intro intro">
          <h1 className="">Victory!</h1>
          <KillList stats={this.props.world.stats}/>
          <Score score={ score } />
          <p>
            Press <span className="button">enter</span>
          </p>
        </div>;
    }
    else if(this.state.step === 1){
      return <div className="wave-intro intro">
          <h1 className="">Next Wave Incoming</h1>
          <h2 className="">Get ready!</h2>
          <p className="">
            Press <span className="button">enter</span>
          </p>
        </div>;
    }
  },
  componentWillReceiveProps: function(props){
    if(props.inputState.keys.enter) {
      var step = this.state.step;
      if( step > 0 ){ 
        Messages.post(Messages.ID.START_NEXT_WAVE, Messages.channelIDs.GAME);
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
    var currentWave = world.waveManager.currentWave;
    if(currentWave === 0){
      this.setState( {
        step : 1
      });
    }
  }
});
module.exports=WaveIntro;
