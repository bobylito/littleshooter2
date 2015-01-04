var React = require('react/addons');
var _ = require('underscore');

var Gauge = React.createClass({
  propTypes:{
    amount : React.PropTypes.number.isRequired,
    label : React.PropTypes.string
  },
  render: function(){
    var style = {
      width: this.props.amount * 100,
    };
    var className = "gauge" + (( this.props.amount < .4) ? " warning" : "");
    return <div className={className} style={ {width: 104} }>
             <span className="label">{this.props.label}</span>
             <div className="value" style={style}/>
           </div>;
  }
});
 module.exports = Gauge;
