var _ = require('underscore');

var messages = [];
var messageIDs = {
  ROCKET_LOST   : 0,
  ROCKET_LAUNCH : 1
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
