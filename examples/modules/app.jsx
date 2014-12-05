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

var aud = require("../data/usd_vs_aud.json");
var audCurrency = [];
_.each(aud.widget[0].data, function(val) {
  audCurrency.push({"time": new Date(val[0]), "value": val[1]});
})

var euro = require("../data/usd_vs_euro.json");
var euroCurrency = [];
_.each(euro.widget[0].data, function(val) {
  euroCurrency.push({"time": new Date(val[0]), "value": val[1]});
})


require('./app.css');

var App = React.createClass({
  render: function() {

    var endTime = audCurrency[0].time;
    var beginTime = audCurrency[audCurrency.length-1].time;

    console.log(beginTime, endTime);

    return (
      <div>
          <div className="row">
              <div className="col-md-12">
                  <h2>Examples</h2>
              </div>
          </div>

          <hr />

          <div className="row">
              <div className="col-md-12">
                  <h3>Horizontal Legend</h3>
              </div>
          </div>

          <div className="row">
              <div className="col-md-3">
                  Legend with lines
              </div>
              <div className="col-md-3">
                  Legend with swatches
              </div>
              <div className="col-md-3">
                  Legend with dots
              </div>
          </div>

          <div className="row">
              <div className="col-md-3">
                  <Legend categories={{"AUD": "aust", "USD": "usa"}} style="line"/>
              </div>
              <div className="col-md-3">
                  <Legend categories={{"Oscars": "oscars", "Total": "total"}} style="swatch" />
              </div>
              <div className="col-md-3">
                  <Legend categories={{"Site": "site", "Router": "router"}} style="dot" />
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
                        <ChartRow height="200" margin="0" padding="10">
                            <YAxis id="currency" type="linear" align="left" format="$,.2f" min={0.5} max={1.25}/>
                            <LineChart axis="currency" data={audCurrency} classed="aud"/>
                            <LineChart axis="currency" data={euroCurrency} classed="euro"/>
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