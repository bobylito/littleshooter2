/** @jsx React.DOM */
var React = require('react/addons');

var Messages = require('./Messages.js');

var WaveIntro = React.createClass({
  render:function(){
    return <div className="wave-intro intro">
             <h1 className="">Next Wave Incoming</h1>
             <h2 className="">Get ready!</h2>
             <p className="">
               Press <span className="button">enter</span>
             </p>
           </div>;
  },
  componentWillReceiveProps: function(props){
    if(props.inputState.keys.enter)
      Messages.post(Messages.ID.START_NEXT_WAVE, Messages.channelIDs.GAME);
  }
});
module.exports=WaveIntro;
