/** @jsx React.DOM */

var React = require('react/addons');

var Intro = React.createClass({
  render:function(){
    return <div className="intro">
      <h1>Little shooter</h1>
      <h2>Press &lt;SPACE&gt;</h2>
    </div>;
  }
});

module.exports = Intro;
