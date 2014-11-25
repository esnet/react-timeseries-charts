/** @jsx React.DOM */

var React = require('react');
var _ = require('underscore');
var {Link} = require('react-router');

var Charts = require("../../esnet-react-charts");
var Legend = Charts.Legend;
var ChartContainer = Charts.ChartContainer;
var ChartRow = Charts.ChartRow;
var YAxis = Charts.YAxis;
var AreaChart = Charts.AreaChart;
var LineChart = Charts.LineChart;
var Resizable = Charts.Resizable;

var currency = require("../data/currency.json");
var convertedCurrency = [];
_.each(currency, function(val) {
  convertedCurrency.push({"time": new Date(val.date), "value": val.value});
});

console.log(convertedCurrency);

require('./app.css');

var App = React.createClass({
  render: function() {

    var beginTime = convertedCurrency[0].time;
    var endTime = convertedCurrency[convertedCurrency.length-1].time;

    console.log(beginTime, endTime);

    return (
      <div>
          <div className="row">
              <div className="col-md-12">
                  <h2>Examples!!</h2>
              </div>
          </div>

          <hr />

          <div className="row">
              <div className="col-md-12">
                  <h3>Legend</h3>
              </div>
          </div>

          <div className="row">
              <div className="col-md-6">
                  <Legend categories={{"Oscars": "oscars", "Total": "total"}} />
              </div>
          </div>

          <hr />

          <div className="row">
              <div className="col-md-12">
                  <h3>Line chart examples</h3>
              </div>
          </div>

          <div className="row">
              <div className="col-md-12">
                  <Resizable>
                    <ChartContainer beginTime={beginTime} endTime={endTime} slotWidth={60}>
                        <ChartRow height="200">
                            <YAxis id="traffic" type="linear" align="left" min={0} max={20000000}/>
                            <LineChart axis="traffic"
                                       data={convertedCurrency}
                                       classed="currency"/>
                        </ChartRow>
                    </ChartContainer>
                  </Resizable>
              </div>
          </div>
      </div>
    );
  }
});

module.exports = App;