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
  BADDIE_DESTROYED: 7
}

module.exports = {
  ID    : messageIDs,
  reset : function(){
    messages = [];
  },
  post  : function(id, val){
    messages.push({
      id:id,
      val:val || null
    });
  },
  get : function(){
    return _.groupBy(messages, 'id');
  }
};
