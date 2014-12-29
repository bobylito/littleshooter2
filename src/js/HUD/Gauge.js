var React = require('react/addons');
var _ = require('underscore');

var Gauge = React.createClass({
  propTypes:{
    amount : React.PropTypes.number.isRequired,
    label : React.PropTypes.string
  },
  render: function(){
    var style = {
      width: this.props.amount * 100
    };
    return <div className="gauge" style={ {width: 105} }>
             <span className="label">{this.props.label}</span>
             <div className="value" style={style}/>
           </div>;
  }
});
 module.exports = Gauge;
