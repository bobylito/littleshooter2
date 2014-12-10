var _ = require('underscore');

var Baddies = require('./Baddies');

/**
 * @param timestamp : current timestamp when this wave is instanciated
 * @param monsters : list of tuple (time to launch from the beginning of the wave, monster id)
 */
function Wave( timestamp, monsters ){
  this.t0 = timestamp;
  this.monsters = monsters;
}
Wave.prototype = {
  getNextMonsters : function( currentTime ){
    var delta = currentTime - this.t0;
    var monstersDefAndRest = this.takeMonster(delta, this.monsters, []);
    this.monsters = monstersDefAndRest[0];
    return _.map( monstersDefAndRest[1], function(monsterID){
      return Baddies.make(monsterID);
    });
  },
  hasNext : function(){
    return this.monsters.length > 0;
  },
  takeMonster: function( currentTime, monsters, res ){
    if( monsters.length === 0 ) return [monsters, res];
    if( monsters[0][0] > currentTime) return [monsters, res];

    var tail = _.tail(monsters);
    res.push( monsters[0][1] );
    return this.takeMonster(currentTime, tail, res);
  }
};

function WavesManager(){
  this.currentWave = 0;
}
WavesManager.prototype = {
  CONFIG : [
    [
      [0, "ouno"],
      [0, "ouno"],
      [2000, "douo"],
      [2000, "ouno"],
      [5000, "trouo"],
      [5000, "ouno"]
    ]
  ],
  getNextWave: function( timestamp ){
    var nextWaveConfig = this.CONFIG[(this.currentWave++) % this.CONFIG.length];
    return new Wave(timestamp, nextWaveConfig);
  }
};

module.exports = {
  WavesManager : WavesManager,
  Wave         : Wave
};
