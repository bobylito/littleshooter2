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
    return _.map( monstersDefAndRest[1], function(monsterIDWithPattern, i, all){
      var pos = [
        (i + 1) / (all.length + 1),
        -0.05
      ];
      return Baddies.make(monsterIDWithPattern[0], pos, monsterIDWithPattern[1]);
    });
  },
  hasNext : function(){
    return this.monsters.length > 0;
  },
  takeMonster: function( currentTime, monsters, res ){
    if( monsters.length === 0 ) return [monsters, res];
    if( monsters[0][0] * 1000 > currentTime) return [monsters, res];

    var tail = _.tail(monsters);
    var monsterName = monsters[0][1];
    var monsterPattern = monsters[0][2];
    res.push( [monsterName, monsterPattern] );

    return this.takeMonster(currentTime, tail, res);
  }
};

function WavesManager(){
  this.currentWave = -1;
}
WavesManager.prototype = {
  CONFIG : require('./levels'),
  getNextWave: function( timestamp, waveNumber){
    if( _.isNumber(waveNumber) )
      this.currentWave = waveNumber;
    else
      this.currentWave = (this.currentWave + 1);

    var nextWaveConfig = this.CONFIG[this.currentWave % this.CONFIG.length];
    return new Wave(timestamp, nextWaveConfig.wave);
  },
  getTotalMonsterInCurrentWave : function(){
    if( this.currentWave === -1 ) return undefined;
    else
      return this.CONFIG[this.currentWave % this.CONFIG.length].wave.length;
  },
  getCurrentWave: function(){
    if( this.currentWave === -1 ) return undefined;
    else
      return this.CONFIG[this.currentWave % this.CONFIG.length].wave;
  },
  getWave: function(i){
    return this.CONFIG[i % this.CONFIG.length];
  }
};

module.exports = {
  WavesManager : WavesManager,
  Wave         : Wave
};
