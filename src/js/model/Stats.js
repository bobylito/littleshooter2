var WaveStats = function(timestamp){
  this.t0     = timestamp;
  this.death  = [];
  this.kill   = {};
  this.miss   = {};
};
WaveStats.prototype = {
  constructor : WaveStats,
  playerDeath : function death(timestamp){
    this.death.push(timestamp);
  },
  addKill     : function kill(monsterType, timestamp){
    if( !this.kill[monsterType] ) this.kill[monsterType] = [timestamp];
    else this.kill[monsterType].push(timestamp);
  },
  addMiss     : function miss(monsterType, timestamp){
    if( !this.miss[monsterType] ) this.miss[monsterType] = [timestamp];
    else this.miss[monsterType].push(timestamp);
  }
};

var Stats = function(timestamp){
  this.t0          = timestamp;
  this.waves       = [];
  this.currentWave = null;
};
Stats.prototype = {
  constructor : Stats,
  newWave     : function newWave(timestamp){
    var newWave = new WaveStats(timestamp);
    this.waves.push( newWave );
    this.currentWave = newWave;
  },
  death       : function deathStat( t )   { this.currentWave.playerDeath( t ); },
  kill        : function  killStat( m, t ){ this.currentWave.addKill( m, t ); },
  miss        : function  missStat( m, t ){ this.currentWave.addMiss( m, t ); }
};

module.exports = Stats;
