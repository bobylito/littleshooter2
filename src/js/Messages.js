var _ = require('underscore');

var messages = [];
var messageIDs = {
  ROCKET_LOST     : 0,
  ROCKET_LAUNCH   : 1,
  SHIP_MOVE_RIGHT : 2,
  SHIP_MOVE_LEFT  : 3,
  SHIP_MOVE_UP    : 4,
  SHIP_MOVE_DOWN  : 5,
  SHIP_DESTROYED  : 6,
  BADDIE_DESTROYED: 7,
  CHANGE_SCREEN   : 8,
  EXPLOSION       : 9,
  BADDIE_HIT      : 10,
  BADDIE_WIN      : 11,
  FLASH           : 20,
  ALERT           : 21,
  START_NEXT_WAVE : 30,
  UPDATE_SCORE    : 40,
  PLAYER_LOSE     : 50,
  STARFIELD_OUT   : 60,
  STARFIELD_IN    : 61,
  SETUP_FX        : 100,
  LOADED_SOUNDS   : 200
}

var channelIDs = {
  ROOT : 0,
  GAME : 1,
  FX   : 2
};

var channels = (function(){
  return _.map(channelIDs, function(){
    return [];
  });
})();

module.exports = {
  ID    : messageIDs,
  channelIDs: channelIDs,
  reset : function( channel ){
    var channelOrRoot = channel || channelIDs.ROOT;
    channels[channelOrRoot] = [];
  },
  post  : function(id, channel, val){
    var channelOrRoot = channel || channelIDs.ROOT;
    channels[channelOrRoot].push({
      id:id,
      val: (_.isUndefined(val) ? null : val)
    });
  },
  get : function( channel ){
    var channelOrRoot = channel || channelIDs.ROOT;
    return _.groupBy(channels[channelOrRoot], 'id');
  }
};
