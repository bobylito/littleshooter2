var transforms = {
  translate: function(x, y){
    return "translate("+x+"px,"+y+"px)";
  },
  scale: function( ratio ){
    return "scale( " + ratio + " )";
  }
};

module.exports = transforms;
