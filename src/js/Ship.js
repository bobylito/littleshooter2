/** @jsx React.DOM */

var React = require('react/addons');
var _ = require('underscore');

var T = require('./Transform');
var Messages = require('./Messages.js');

var Ship = React.createClass({
  getInitialState:function(){
    return {
      lastFire : 0
    };
  },
  render : function(){
    var ship = this.props.ship;
    var style = {
      transform : T.translate( 
          ship.position[0] * (this.props.screen.width),
          ship.position[1] * (this.props.screen.height))};
    var cssClasses  = ["ship", "positionable"];
    var laserX      = ship.position[0] + ship.size[0] / 2;
    var hitBaddie   = this.getFirstHitBaddie( laserX, this.props.baddies );
    var laserHeight = hitBaddie ? Math.abs(hitBaddie.position[1] + hitBaddie.size[1] - ship.position[1]) : 1;

    if(ship.isInvincible) cssClasses.push("blink");

    return <div className={ cssClasses.join(" ")} style={style}>
             <div className="laser" style={ {height: laserHeight * this.props.screen.height} }/> 
           </div>;
  },
  shouldComponentUpdate: function(nextProps){
    //It should work but it won't since the model is not immutable
    var currentShip = this.props.ship;
    var nextShip = nextProps.ship;
    var baddiesInRange = this.baddiesInRange( nextShip.position[0] + ( nextShip.size[0] / 2 ), nextProps.baddies);
    return baddiesInRange || 
            (currentShip.position[0] != nextShip.position[0] ||
             currentShip.position[1] != nextShip.position[1]  || 
            ( currentShip.isInvincible && !nextShip.isInvincible) ||
            (!currentShip.isInvincible &&  nextShip.isInvincible)
           );
  },
  getFirstHitBaddie: function( x, baddies ){
    var collidingBaddies = this.baddiesInRange(x, baddies);
    if( _.isEmpty( collidingBaddies ) ) return undefined;
    var firstInRange = _.max( collidingBaddies, function getY(b){
      return b.position[1];
    });
    return firstInRange;
  },
  baddiesInRange : function(x, baddies){
    return _.filter( baddies, function collideWithRay(b){
      return x > b.position[0] && x < (b.position[0] + b.size[0]);
    });
  },
  componentWillReceiveProps:function( props ){
    this.updateState(props.inputState, props.world);
  },
  updateState : function(input, world){
    var ship = this.props.ship;

    if(input.keys.right)  { Messages.post( Messages.ID.SHIP_MOVE_RIGHT, Messages.channelIDs.GAME, input.keys.right); }
    if(input.keys.left)   { Messages.post( Messages.ID.SHIP_MOVE_LEFT , Messages.channelIDs.GAME, input.keys.left); }
    if(input.keys.up)     { Messages.post( Messages.ID.SHIP_MOVE_UP   , Messages.channelIDs.GAME, input.keys.up); }
    if(input.keys.down)   { Messages.post( Messages.ID.SHIP_MOVE_DOWN , Messages.channelIDs.GAME, input.keys.down); }

    if(input.keys.space)  {
      if( input.time > this.state.lastFire + 50 && !ship.isInvincible) {
        var shipPos = ship.position;
        
        Messages.post(
          Messages.ID.ROCKET_LAUNCH,
          Messages.channelIDs.GAME,
          { pos : [
              shipPos[0] + ship.size[0] / 2,
              shipPos[1]  
            ]
          }
        );
        
        this.setState({
          lastFire: input.time
        });
      }
    }

  },
});

module.exports = Ship;
