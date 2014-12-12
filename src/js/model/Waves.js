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
    if( monsters[0][0] > currentTime) return [monsters, res];

    var tail = _.tail(monsters);
    var monsterName = monsters[0][1];
    var monsterPattern = monsters[0][2];
    res.push( [monsterName, monsterPattern] );

    return this.takeMonster(currentTime, tail, res);
  }
};

function WavesManager(){
  this.currentWave = 0;
}
WavesManager.prototype = {
  CONFIG : [
    [
      [0,    "ouno", "straight"],
      [2000,  "ouno", "straight"],
      [3000, "ouno", "straight"],
      [4000, "ouno", "square"],
      [5000, "ouno", "square"],
      [5000, "ouno", "square"],
      [10000, "ouno", "square"],
      [10000, "ouno", "square"],
      [10000, "ouno", "square"],
      [15000, "ouno", "square"],
      [15000, "ouno", "square"],
      [20000,  "ouno", "square"],
      [20000, "ouno", "straight"],
      [23000, "ouno", "straight"],
      [23000, "ouno", "straight"],
      [23000, "ouno", "straight"]
    ],
    [
      [0,    "ouno", "straight"],
      [0,  "ouno", "straight"],
      [4000,  "trouo",   "straight"],
      [4000,  "trouo",  "straight"],
      [8000,    "ouno", "straight"],
      [8000,  "trouo",   "straight"],
      [8000,  "ouno", "straight"]
    ],
    [
      [0,    "ouno", "straight"],
      [0,  "ouno", "straight"],
      [4000,  "trouo",   "straight"],
      [4000,  "trouo",  "straight"],
      [8000,  "douo", "straight"],
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
