/** @jsx React.DOM */
var React = require('react/addons');
var _     = require('underscore');

var Messages = require('../Messages.js');
var Utils    = require('../Utils.js');
var T        = require('../Transform');

var id = Utils.idGenFactory();

var ParticleSystem = React.createClass({
  getInitialState: function(){
    return {
      innerTimeTick: 0,
      particles: []
    };
  },
  render: function(){
    var now = this.state.innerTimeTick;
    var screen = this.props.screen;
    var particles = _.map(this.state.particles, function(p){
      var elapsed = now - p.t0;
      var newPos  = [
        (p.pos[0] + p.dir[0] * elapsed) * screen.width,
        (p.pos[1] + p.dir[1] * elapsed) * screen.height
      ];
      var style   = {
        transform: T.translate(newPos[0], newPos[1]) + " " + T.scale( (-Math.pow( (elapsed/100) - 1 ,2) + 3) )
      };
      return <div className="particle positionable explosion" style={style} key={p.id}/>;
    });
    return <div className="particleSystem">{particles}</div>
  },
  componentWillReceiveProps: function(props){
    var self= this;
    var now = props.inputState.time;
    var c   = this.createParticle.bind(this, now, 400);
    var msg = Messages.get(Messages.channelIDs.FX)[Messages.ID.EXPLOSION] || [];
    var particles = _(msg).chain()
      .map(function(m){
        var dirs = _.map( _.range(5), self.randomVec2);
        return _.map(dirs, c.bind(this, m.val));
      }).flatten().value();
    Messages.reset( Messages.channelIDs.FX );
    this.setState({
      innerTimeTick: now,
      particles : particles
    });
  },
  tick : function(){
    var now = Date.now();
    var prunedParticles = _.filter(this.state.particles, function(p){
      return p.expiration > now;
    });
    this.setState({
      innerTimeTick: now,
      particles : prunedParticles
    });
    setTimeout( this.tick, 16 );
  },
  componentWillMount: function(){
    this.tick();
  },
  randomVec2: function(){
    return [
      (Math.random() - 0.5) * 0.001,
      (Math.random() - 0.5) * 0.001
    ];
  },
  createParticle: function(now, duration, position, dir){
    return {
      id         : id(),
      t0         : now,
      pos        : position,
      expiration : now + duration,
      dir        : dir
    };
  }
});

module.exports = ParticleSystem;
