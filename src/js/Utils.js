//A bunch of utils (it had to be done at some point right)
var idGenFactory = function idGenFactory(){
  var current = Number.MIN_SAFE_INTEGER;
  return function idGen(){ return current++; };
};

module.exports = {
  idGenFactory: idGenFactory
};
