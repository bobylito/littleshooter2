/** @jsx React.DOM */

var w = window;
var d = w.document;
var React = require('react/addons');
var _ = require('underscore');

var Messages = require('../Messages.js');
var Utils = require('../Utils.js');

var id = Utils.idGenFactory();

var ParticleSystem = React.createClass({
  getInitialState: function(){
    return {
      particles: []
    };
  },
  render: function(){
    var now = this.props.inputState.time;
    var screen = this.props.screen;
    var particles = _.map(this.state.particles, function(p){
      var elapsed = now - p.t0;
      var newPos  = [
        (p.pos[0] + p.dir[0] * elapsed) * screen.width,
        (p.pos[1] + p.dir[1] * elapsed) * screen.height
      ];
      var style   = {
        left : newPos[0],
        top  : newPos[1]
      };
      return <div className="particle" style={style}/>;
    });
    return <div className="particleSystem">{particles}</div>
  },
  componentWillReceiveProps: function(props){
    var self= this;
    var now = props.inputState.time;
    var c   = this.createParticle.bind(this, now, 2000);
    var msg = Messages.get(Messages.channelIDs.FX)[Messages.ID.EXPLOSION] || [];
    var particles = _(msg).chain()
      .map(function(m){
        var dirs = _.map( _.range(5), self.randomVec2);
        return _.map(dirs, c.bind(this, m.val));
      }).flatten().value();
    Messages.reset( Messages.channelIDs.FX );
    var prunedParticles = _.filter(this.state.particles, function(p){
      return p.expiration > now;
    });
    this.state.particles = prunedParticles.concat(particles);
  },
  randomVec2: function(){
    return [
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01
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
