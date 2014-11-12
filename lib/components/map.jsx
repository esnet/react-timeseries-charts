/** @jsx React.DOM */

var React = require('react');

/**
 *
 * Map expects the following props
 * 
 */
var BaseMap = React.createClass({
    getDefaultProps: function() {
        return {
            width: 800,
            height: 600,
            margin: 20,
            edgeType: "simple",
            legendItems: null
        }
    },

    render: function() {
        var xScale = d3.scale.linear()
                       .range([this.props.margin,
                               this.props.width - this.props.margin]);
        var yScale = d3.scale.linear()
                       .range([this.props.margin,
                               this.props.height - this.props.margin]);

        var nodeCoordinates = {};
        var nodes = _.map(this.props.topology.nodes, function(node) {
            var x = xScale(node.x);
            var y = yScale(node.y);
            nodeCoordinates[node.name] = {x: x, y: y};
            var label = _.isUndefined(node.label) ? node.name : node.label;
            return <MapNode x={x}
                            y={y}
                            name={node.name}
                            key={node.name}
                            type={node.type}
                            labelPosition={node.labelPosition}
                            label={label}
                            radius={node.radius} />;
        });

        if(this.props.edgeType === "bidirectionalArrow") {
            var edges = _.map(this.props.topology.edges, function(edge) {
                var edgeKey = edge.source + "--" + edge.target;
                return <BidirectionalArrowMapEdge x1={nodeCoordinates[edge.source].x}
                                x2={nodeCoordinates[edge.target].x}
                                y1={nodeCoordinates[edge.source].y}
                                y2={nodeCoordinates[edge.target].y}
                                source={edge.source}
                                target={edge.target}
                                sourceTargetColor={edge.sourceTargetColor}
                                targetSourceColor={edge.targetSourceColor}
                                strokeWidth={edge.width}
                                key={edgeKey} />
            });
        } else {
            var edges = _.map(this.props.topology.edges, function(edge) {
                var edgeKey = edge.source + "--" + edge.target;
                return <SimpleMapEdge x1={nodeCoordinates[edge.source].x}
                                x2={nodeCoordinates[edge.target].x}
                                y1={nodeCoordinates[edge.source].y}
                                y2={nodeCoordinates[edge.target].y}
                                source={edge.source}
                                target={edge.target}
                                stroke={edge.stroke}
                                strokeWidth={edge.width}
                                key={edgeKey} />
            });
        }

        var labels = _.map(this.props.topology.labels, function(label) {
            var x = xScale(label.x);
            var y = yScale(label.y);
            return <MapLabel x={x}
                             y={y}
                             label={label.label}
                             labelPosition={label.labelPosition}
                             key={label.label} />
        });

        var legend = null;

        if(!_.isNull(this.props.legendItems)){
            legend = <BaseMapLegend x={this.props.legendItems.x}
                                    y={this.props.legendItems.y}
                                    edgeTypes={this.props.legendItems.edgeTypes}
                                    nodeTypes={this.props.legendItems.nodeTypes}
                                    colorSwatches={this.props.legendItems.colorSwatches} />;
        }

        return (
            <svg width={this.props.width}
                 height={this.props.height}
                 className={"map-container"}>
                <g>
                {edges}
                {nodes}
                {labels}
                {legend}
                </g>
            </svg>
        );
    }
});

var MapNode = React.createClass({
    getDefaultProps: function() {
        return {
            radius: 5
        }
    },

    render: function() {
        var style = { };
        var nodeClasses = "map-node " + this.props.type;
        var labelClasses = "map-node-label " + this.props.type;

        var basicOffset = this.props.radius * 1.33;
        var fontOffset = 8; // 0.8 * font size? ish..
        var labelX = this.props.x;
        var labelY = this.props.y;
        var textAnchor = "middle";

        switch (this.props.labelPosition) {
            case "left":
                labelX -= basicOffset;
                labelY += 5;
                textAnchor = "end";
                break;

            case "right":
                labelX += basicOffset;
                labelY += 5;
                textAnchor = "start";
                break;

            case "top":
                labelY -= basicOffset;
                break;

            case "topright":
                labelY -= basicOffset;
                labelX += basicOffset;
                textAnchor = "start";
                break;

            case "topleft":
                labelY -= basicOffset;
                labelX -= basicOffset;
                textAnchor = "end";
                break;

            case "bottom":
                labelY += basicOffset + fontOffset;
                break;

            case "bottomrigh":
                labelY += basicOffset + fontOffset;
                labelX += basicOffset;
                textAnchor = "start";
                break;

            case "bottomleft":
                labelY += basicOffset + fontOffset;
                labelX -= basicOffset;
                textAnchor = "end";
                break

            default:
                break;
        }

        var nodeElement;
        if (this.props.type === "cloud") {
            var cloudPath = "M" + this.props.x + "," + (this.props.y+5);
            cloudPath += "l-25,0 c-10,0 -10,-10 -5,-15";
            cloudPath += "c5,-5 15,-5 15,0 c0,-15 25,-15 25,-5 c10,-10 25,15 10,20 Z";
            nodeElement = <path d={cloudPath}
                                className={nodeClasses} />;

            switch (this.props.labelPosition) {
                case "top":
                case "topright":
                case "topleft":
                    labelY += 7;
                    break;
                case "bottom":
                case "bottomleft":
                case "bottomrigh":
                    labelY -= 15;
                    break;
            };
            labelX -= 3;
        } else {
            nodeElement = <circle cx={this.props.x}
                                  cy={this.props.y}
                                  r={this.props.radius}
                                  style={style}
                                  className={nodeClasses} />;
        }

        return (
            <g>
                {nodeElement}
                <text x={labelX}
                      y={labelY}
                      textAnchor={textAnchor}
                      className={labelClasses} >{this.props.label}</text>
            </g>
        );
    }
});

var MapLabel = React.createClass({
    render: function() {
        var textAnchor;

        switch (this.props.labelPosition) {
            case "left":
                textAnchor = "end";
                break;

            case "top":
            case "bottom":
                textAnchor = "middle";
                break;

            default:
                textAnchor = "start";
        }

        return (
            <text x={this.props.x}
                  y={this.props.y}
                  label={this.props.label}
                  textAnchor={textAnchor}
                  className={"map-label"}>
                {this.props.label}
            </text>
        );
    }
});

var SimpleMapEdge = React.createClass({
    getDefaultProps: function() {
        return {
            stroke: "#ddd",
            strokeWidth: 4
        }
    },

    render: function() {
        return (
            <line x1={this.props.x1}
                  x2={this.props.x2}
                  y1={this.props.y1}
                  y2={this.props.y2}
                  stroke={this.props.stroke}
                  strokeWidth={this.props.strokeWidth} />
        );
    }
});

var BidirectionalArrowMapEdge = React.createClass({
    getDefaultProps: function() {
        return {
            spacing: 3.5,
            offset: 18,
            sourceTargetColor: "#C9CACC",
            targetSourceColor: "#C9CACC"
        }
    },

    render: function() {
        var paths = this._linePaths("foo");
        return (<g>{paths}</g>);
    },

    _linePaths: function(classes) {
        var gStyle = {
        };

        var lineStyle = {
            "stroke-opacity": 1, 
            "cursor": "pointer" ,
            "stroke-width": this.props.strokeWidth
        };

        var arrowStyle = {
        }

        var paths = [];

        var line = this._endpoints(this.props.x1,
                                   this.props.y1,
                                   this.props.x2,
                                   this.props.y2,
                                   1,
                                   this.props.spacing,
                                   this.props.offset);

        var path = "M" + this.props.x1 + "," + this.props.y1 + " L " + line.x1 
                    + "," + line.y1 + " L " + line.x2 + "," + line.y2;

        var edgeName = this.props.source + "--" + this.props.target;

        var linePath = <path d={path}
                             fill={"none"}
                             stroke={this.props.sourceTargetColor}
                             strokeLinecap={"round"}
                             strokeWidth={1}
                             className={"map-edge"}
                             style={lineStyle} />;

        path = "M" + line.arrowx0 + "," + line.arrowy0 +
               "L" + line.arrowx1 + "," + line.arrowy1 +
               "L" + line.arrowx2 + "," + line.arrowy2 + "Z";

        var arrowPath = <path d={path}
                              className={"map-edge-arrow"}
                              fill={this.props.sourceTargetColor}
                              stroke={this.props.sourceTargetColor}
                              style={arrowStyle} />;

        paths.push(
            <g key={edgeName} id={edgeName}>
                {linePath}
                {arrowPath}
            </g>
        );
                //<line x1={line.x1mid} y1={line.y1mid} x2={line.x2mid} y2={line.y2mid} stroke={"#eee"} strokeWidth={"4"} />

        edgeName = this.props.target + "--" + this.props.source;

        line = this._endpoints(this.props.x1,
                                   this.props.y1,
                                   this.props.x2,
                                   this.props.y2,
                                   -1,
                                   this.props.spacing,
                                   this.props.offset);
        path = "M" + this.props.x2 + "," + this.props.y2 + " L " + line.x2 
                    + "," + line.y2 + " L " + line.x1 + "," + line.y1;

        linePath = <path d={path}
                         fill={"none"}
                         stroke={this.props.targetSourceColor}
                         strokeLinecap={"round"}
                         className={"map-edge"}
                         style={lineStyle} />;

        line = this._endpoints(this.props.x2,
                                   this.props.y2,
                                   this.props.x1,
                                   this.props.y1,
                                   1,
                                   this.props.spacing,
                                   this.props.offset);

        path = "M" + line.arrowx0 + "," + line.arrowy0 + 
               "L" + line.arrowx1 + "," + line.arrowy1 + 
               "L" + line.arrowx2 + "," + line.arrowy2 + "Z";

        arrowPath = <path d={path}
                          className={"link-arrow"}
                          fill={this.props.targetSourceColor}
                          stroke={this.props.targetSourceColor}
                          className={"map-edge-arrow"}
                          style={arrowStyle} />;

        paths.push(
            <g key={edgeName} id={edgeName}>
                {linePath}
                {arrowPath}
            </g>
            /*
                <line x1={line.x1mid} y1={line.y1mid} x2={line.x2mid} y2={line.y2mid} stroke={"#eee"} strokeWidth={"6"} />
                <line x1={line.x1mida} y1={line.y1mida} x2={line.x2mida} y2={line.y2mida} stroke={"#111"} strokeWidth={"1"} />
                <line x1={line.x1midb} y1={line.y1midb} x2={line.x2midb} y2={line.y2midb} stroke={"#111"} strokeWidth={"1"} />
            */
        );

        return paths;
    },

    //
    // Returns a line from source to target, offset from the center line by pos
    //    target/source 
    //    pos             - the position on either side of a center line. 
    //    spacing         - 
    //    offset          - how far from the center of the node lines stop spreading out 
    //and start being parallel 
    //
    _endpoints: function(sourcex, sourcey, targetx, targety, pos, spacing, offset) {
        var endpoints = {};
        //var offset = 15;
        var offset2 = spacing;
        var pos2 = pos;
        var dx = targetx - sourcex;
        var dy = targety - sourcey;
        var len = Math.sqrt(dx*dx + dy*dy);
        var dxnorm = dx/len;
        var dynorm = dy/len;
        var perpx = -dynorm;
        var perpy = dxnorm;
        var arrowWidth = spacing*2;
        var arrowHeight = spacing*2;
        var mid = len / 2.0;

        endpoints.x1 = sourcex +  dxnorm*offset + perpx*offset2*pos2;
        endpoints.y1 = sourcey +  dynorm*offset + perpy*offset2*pos2;
        endpoints.x2 = targetx -  dxnorm*offset + perpx*offset2*pos2;
        endpoints.y2 = targety -  dynorm*offset + perpy*offset2*pos2;

        endpoints.x1mid = sourcex + dxnorm*mid + perpx*spacing*1.75;
        endpoints.y1mid = sourcey + dynorm*mid + perpy*spacing*1.75;
        endpoints.x2mid = sourcex + dxnorm*mid + perpx*spacing*-1.75;
        endpoints.y2mid = sourcey + dynorm*mid + perpy*spacing*-1.75;

        endpoints.x1mida = sourcex + dxnorm*(mid+3) + perpx*spacing*2;
        endpoints.y1mida = sourcey + dynorm*(mid+3) + perpy*spacing*2;
        endpoints.x2mida = sourcex + dxnorm*(mid+3) + perpx*spacing*-2;
        endpoints.y2mida = sourcey + dynorm*(mid+3) + perpy*spacing*-2;

        endpoints.x1midb = sourcex + dxnorm*(mid-3) + perpx*spacing*2;
        endpoints.y1midb = sourcey + dynorm*(mid-3) + perpy*spacing*2;
        endpoints.x2midb = sourcex + dxnorm*(mid-3) + perpx*spacing*-2;
        endpoints.y2midb = sourcey + dynorm*(mid-3) + perpy*spacing*-2;

        endpoints.arrowx0 = endpoints.x2 + dxnorm*arrowHeight;
        endpoints.arrowy0 = endpoints.y2 + dynorm*arrowHeight;
        endpoints.arrowx1 = endpoints.x2 + perpx*arrowWidth/2;
        endpoints.arrowy1 = endpoints.y2 + perpy*arrowWidth/2;
        endpoints.arrowx2 = endpoints.x2 - perpx*arrowWidth/2;
        endpoints.arrowy2 = endpoints.y2 - perpy*arrowWidth/2;

        return endpoints;
    }
});

var BaseMapLegend = React.createClass({
    getDefaultProps: function() {
        return {
            x: 0,
            y: 0,
            lineHeight: 20,
            columns: true,  // if not then all items are done in one column
            columnWidth: 100,
            exampleWidth: 20,
            gutter: 8,
            edgeColor: "#333",
            nodeTypes: [],
            edgeTypes: [],
            colorSwatches: []
        }
    },

    render: function() {
        var self = this;
        var curX = this.props.x;
        var curY = this.props.y;

        var elements = [];
        var lineCenter = this.props.lineHeight / 2;

        if(this.props.nodeTypes.length > 0) {
            _.each(this.props.nodeTypes, function(node) {

                curY += self.props.lineHeight;
            });

            if(this.props.columns) {
                curX += this.props.columnWidth;
                curY = this.props.y;
            }
        }

        if (this.props.edgeTypes.length > 0) {
            _.each(this.props.edgeTypes, function(edge) {
                var x = curX;
                var y = curY + lineCenter - edge.strokeWidth;
                var textX = x + self.props.exampleWidth + self.props.gutter;
                var textY = curY + lineCenter;

                elements.push(
                    <g>
                        <line x1={x}
                              y1={y}
                              x2={x+self.props.exampleWidth}
                              y2={y}
                              stroke={self.props.edgeColor}
                              strokeWidth={edge.strokeWidth} />
                        <text x={textX} y={textY} textAnchor={"begin"}>
                            {edge.text}
                        </text>
                    </g>
                );

                curY += self.props.lineHeight;
            });

            if(this.props.columns) {
                curX += this.props.columnWidth;
                curY = this.props.y;
            }
        }

        if (this.props.colorSwatches.length > 0) {
            var width = this.props.exampleWidth;
            var height = this.props.lineHeight - 4;

            _.each(this.props.colorSwatches, function(color) {
                var x = curX;
                var y = curY;
                var textX = x + self.props.exampleWidth + self.props.gutter;
                var textY = curY + lineCenter;

                elements.push(
                    <g>
                        <rect x={x}
                              y={y}
                              width={width}
                              height={height}
                              stroke={color.stroke}
                              fill={color.fill} />
                        <text x={textX} y={textY} textAnchor={"begin"}>
                            {color.text}
                        </text>
                    </g>
                );

                curY += self.props.lineHeight;
            });

            if(this.props.columns) {
                curX += this.props.columnWidth;
                curY = this.props.y;
            }
        }

        return (
            <g>
                {elements}
            </g>
        );
    }
})

var MapView = React.createClass({
    getDefaultProps: function() {
        return {
            linkMode: "linearBidirectionalTraffic",
            width: 800,
            height: 600,
            cellSize: 4.5,
            pathWidth: 3,
            legend: [
                {color: "#990000", label: "Over 50 Gbps", range: [50, 100]},
                {color: "#bd0026", label: "20 - 50", range: [20, 50]},
                {color: "#cc4c02", label: "10 - 20", range: [10, 20]},
                {color: "#016c59", label: "5 - 10", range: [5, 10]},
                {color: "#238b45", label: "2 - 5", range: [2, 5]},
                {color: "#3690c0", label: "1 - 2", range: [1, 2]},
                {color: "#74a9cf", label: "0 - 1", range: [0, 1]}
            ],
            nodeSize: function(type) {
                return 100;
            },
            timestampLeft: 0,
            timestampTop: 0
        }
    },

    componentDidMount: function() {
        //D3 map
        this.map = d3.esnet.map();

        //D3 map setup
        this.map
            .container(this.getDOMNode())
            .linkDisplayType(this.props.linkMode)
            .trafficColor(this.trafficColorFromSpeed)
            .size({w: this.props.width, h: this.props.height})
            .nodeSize(this.props.nodeSize)
            .pathWidth(this.props.pathWidth)
            .grid(this.props.cellSize);

        var processedTopology = this._processTopology(this.props.topologyData,
                                                      this.props.cellSize)
        //D3 map draw topology
        this.map.topology().draw(processedTopology);
        this.map.topology().show(); 

        // unroll edge traffic so that each direction has an entry
        var edgeTraffic = {};
        _.each(this.props.trafficData.edges, function(edge, k) {
            _.each(edge.bps, function(b, kk) {
                edgeTraffic[kk] = {"bps": b};
            });
        });

        var pathTraffic = this.props.trafficData.paths;
        var trafficTimestamp = this.props.trafficData.timestamp;

        this.map.updateTraffic(edgeTraffic, pathTraffic, trafficTimestamp);        

        // this isn't what we want here, it's UGLY:
        //this.map.showTrafficTimestamp(780, 0);

        // XXX(jdugan): redo this when map gets componentized, this should
        //              really be a React component
        var timestampText = "Last update: ";
        timestampText += d3.time.format("%x %H:%M")(new Date(trafficTimestamp * 1000));
        d3.select(this.getDOMNode()).append("div")
                                        .attr("class", "last-update-info")
                                        .style("position", "absolute")
                                        .style("left", this.props.timestampLeft + "px")
                                        .style("top", this.props.timestampTop + "px")
                                        .text(timestampText);

    },

    shouldComponentUpdate: function(props) {
        // render component using props arg
        return false;
    },

    render: function() {
        return (
            <div>
            </div>
        );
    },

    nodeSize: function (type) {
        if (type == "demo")
            return 150;
        if (type === "site" || type === "demo_site")
            return 300;
        if (type === "sc13")
            return 300;
        if (type === "cloud")
            return 1500;
        if (type === "exchange")
            return 100;
        return 100;
    },

    trafficColorFromSpeed: function (trafficSpeed) {
        var i;
        for (i = 0; i < this.props.trafficLegendData.length; i++) {
            if (trafficSpeed >= this.props.trafficLegendData[i].range[0] &&
                trafficSpeed < this.props.trafficLegendData[i].range[1]) {
                return this.props.trafficLegendData[i].color;
            }
        }
        return "#000";
    },

    _processTopology: function(data, cellSize) {
        var nodeMap,
            topologyData;   //The topology data returned by this function

        nodeMap = {};
        topologyData = {nodes: {optical: [], routed: []},
                        links: {optical: [], routed: []},
                        paths: [] };

        var modelData = $.extend(true, {}, data);

        topologyData.nodes.routed = modelData.nodes;
        topologyData.links.routed = modelData.edges;

        topologyData.paths = modelData.paths;

        topologyData.nodes.routed.forEach(function (d) {
            d.x = d.x * cellSize;
            d.y = (d.y - 15) * cellSize;
        });
        topologyData.nodes.routed.forEach(function (d, i) {
            nodeMap[d.name] = i;
        });
        topologyData.links.routed.forEach(function (d) {
            d["circuit_id"] = d.source + "--" + d.target;
            d["source"] = nodeMap[d.source];
            d["target"] = nodeMap[d.target];
            d["type"] = "routed";
        });

        return topologyData;
    }


});

var MapLegendView = React.createClass({
    getDefaultProps: function() {
        return {
            width: 300,
            height: 300,
            top: 100,
            nodeLegendData: [
                {color: "#990000", label: "Router", class: "router-on-path", size: 100},
                {color: "#bdbdbd", label: "Site", class: "site", size: 300},
                {color: "#E6EBED", label: "Cloud", class: "cloud", size: 1500}
            ],
            textLeft: 0,
            trafficLeft: 120
        }
    },

    componentDidMount: function(){
        var legends = d3.select(this.getDOMNode())
            .append("svg")
                .attr("width", this.props.width)
                .attr("height", this.props.height)
                .append("svg:g")
                    .attr("transform", "translate(20,0)");

        var routerLegend = legends.append("svg:g")
            .attr("transform", "translate(" + this.props.textLeft
                                          + "," + (this.props.top+12) + ")")
            .selectAll(".router-legend")
                .data(this.props.nodeLegendData)
              .enter()
                .append("svg:g")
                    .attr("transform", function (d, i) {
                        return "translate(0," + i * 35 + ")";
                    });
        routerLegend.append("svg:path")
            .attr("d", d3.svg.symbol().type("circle").size(function (d) { return d.size; }))
            .attr("class", function (d) { return d.class; });
          
        routerLegend.append("svg:text")
            .attr("dx", 25)
            .attr("dy", 5)
            .text(function (d) { return d.label; })
            .style("font-size", "12px");

        var trafficLegend = legends.append("svg:g")
            .attr("transform", "translate(" + this.props.trafficLeft 
                                          + "," + this.props.top+")")
            .attr("class", "traffic-legends")
            .selectAll(".traffic-legend")
                .data(this.props.trafficLegendData)
              .enter()
                .append("svg:g")
                .attr("class", "traffic-legend")
                .attr("transform", function (d, i) {
                    return "translate(0," + i * 15 + ")";
                });

        trafficLegend.append("svg:rect")
            .attr("width", 25).attr("height", 10).attr("x", 0).attr("y", 1)
            .style("fill", function (d) { return d.color; });
                
        trafficLegend.append("svg:text")
            .text(function (d) { return d.label; })
            .attr("dx", 32)
            .attr("dy", 10)
            .style("font-size", "12px");        

        /*var map = [];
        _.each(this.props.legend, function(d, key) {
            _.each(d, function(dd) {
                map.push({color: dd.color, label: dd.label});
            })
        });

        var items = d3.select(this.getDOMNode()).selectAll("li")
            .data(map)
          .enter()
            .append("li")
            .text(function(d) { return d.label; });

        items.append("span")
            .style("background-color", function(d) { return d.color; })*/
    },

    shouldComponentUpdate: function(props) {
        // render component using props arg
        return false;
    },

    render: function() {
        return (
            <div>
            </div>
        );
    },
});

module.exports.BaseMap = BaseMap;
module.exports.MapView = MapView;
module.exports.MapLegendView = MapLegendView;