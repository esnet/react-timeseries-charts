/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import _ from "underscore";
import merge from "merge";
import React from "react";
import PropTypes from "prop-types";
import { Event, TimeEvent, IndexedEvent, max, median, min, percentile, TimeSeries } from "pondjs";

import EventMarker from "./EventMarker";
import { Styler } from "../js/styler";
import { scaleAsString } from "../js/util";

const defaultFillStyle = {
    fill: "steelblue",
    stroke: "none"
};

const defaultMutedStyle = {
    fill: "grey",
    stroke: "none"
};

const defaultStyle = [
    {
        normal: { ...defaultFillStyle, opacity: 0.2 },
        highlighted: { ...defaultFillStyle, opacity: 0.3 },
        selected: { ...defaultFillStyle, opacity: 0.3 },
        muted: { ...defaultMutedStyle, opacity: 0.1 }
    },
    {
        normal: { ...defaultFillStyle, opacity: 0.5 },
        highlighted: { ...defaultFillStyle, opacity: 0.6 },
        selected: { ...defaultFillStyle, opacity: 0.6 },
        muted: { ...defaultMutedStyle, opacity: 0.2 }
    },
    {
        normal: { ...defaultFillStyle, opacity: 0.9 },
        highlighted: { ...defaultFillStyle, opacity: 1.0 },
        selected: { ...defaultFillStyle, opacity: 1.0 },
        muted: { ...defaultMutedStyle, opacity: 0.2 }
    }
];

const defaultAggregation = {
    size: "5m",
    reducers: {
        outer: [min(), max()],
        inner: [percentile(25), percentile(75)],
        center: median()
    }
};

function getSeries(series, column) {
    return series.map(e => {
        const v = e.get(column);
        const d = {};
        switch (v.length) {
            case 1:
                d.center = v[0];
                break;
            case 2:
                d.innerMin = v[0];
                d.innerMax = v[1];
                break;
            case 3:
                d.innerMin = v[0];
                d.center = v[1];
                d.innerMax = v[2];
                break;
            case 4:
                d.outerMin = v[0];
                d.innerMin = v[1];
                d.innerMax = v[2];
                d.outerMax = v[3];
                break;
            case 5:
                d.outerMin = v[0];
                d.innerMin = v[1];
                d.center = v[2];
                d.innerMax = v[3];
                d.outerMax = v[4];
                break;
            default:
                console.error("Tried to make boxchart from invalid array");
        }
        const ee = new IndexedEvent(e.index(), d);
        return ee;
    });
}

function getAggregatedSeries(series, column, aggregation = defaultAggregation) {
    const { size, reducers } = aggregation;
    const { inner, outer, center } = reducers;

    function mapColumn(c, r) {
        const obj = {};
        obj[c] = r;
        return obj;
    }

    const fixedWindowAggregation = {};

    if (inner) {
        fixedWindowAggregation.innerMin = mapColumn(column, inner[0]);
        fixedWindowAggregation.innerMax = mapColumn(column, inner[1]);
    }

    if (outer) {
        fixedWindowAggregation.outerMin = mapColumn(column, outer[0]);
        fixedWindowAggregation.outerMax = mapColumn(column, outer[1]);
    }

    if (center) {
        fixedWindowAggregation.center = mapColumn(column, center);
    }

    const aggregatedSeries = series.fixedWindowRollup({
        windowSize: size,
        aggregation: fixedWindowAggregation
    });

    return aggregatedSeries;
}

/**
 * Renders a boxplot chart.
 *
 * The TimeSeries supplied to the boxplot, as the `series` prop can be one of two types:
 *
 *  1) It can be a TimeSeries containing IndexedEvents or TimeRangeEvents.
 *     In this case a `column` prop should be supplied to specify the
 *     data column containing the dimensions of the boxes. This props
 *     should be an array of size 1 to 5 elements. e.g. [12, 18, 22, 28]. The
 *     numbers should be ordered, lowest to greatest.
 *
 *  2) A TimeSeries containing timestamp based Events. In this case the
 *     boxplot will be aggregated for you. To control the aggregation you can supply
 *     an `aggregation` prop: a structure to specify the window size and
 *     reducers used to determine the boxes.
 *
 * In both cases you are generating up to two ranges and a center marker. In the
 * first case you are defining this based on the array of numbers. The outer numbers
 * specify the outerRange, the inner numbers specify the innerRange and the middle
 * number specifies the center marker. In the second case you are building those ranges
 * from denser data, specifying a window and aggregation functions to build each
 * of the ranges and center maker.
 *
 * In both cases you do not need to supply all the values. For example if you
 * provide an array of 2 elements, that would define a single range, with no outer range
 * and no center marker. The BoxChart is pretty flexible in that way, so you
 * can use it in many situations.
 *
 * Here is an example of using it to display temperature ranges. The series
 * passed to this code would be a TimeSeries containing IndexedEvents. For
 * each event, the column `temp` contains an array of values used for the
 * box plot ranges:
 *
 * ```
 *     <BoxChart
 *       axis="temperatureAxis"
 *       style={style}
 *       column="temp"
 *       series={series} />
 * ```
 *
 * While here is an example with a dense TimeSeries of Events supplied,
 * along with an aggregation specification. This code would produce an
 * outer range from the 5th percentile to the 95th, along with an inner
 * range for the interquantile, and a center marker at the median:
 *
 * ```
 *    <BoxChart
 *      axis="speedaxis"
 *      series={speed}
 *      column="speed"
 *      style={style}
 *      aggregation={{
 *        size: this.state.rollup,
 *        reducers: {
 *          outer: [percentile(5), percentile(95)],
 *          inner: [percentile(25), percentile(75)],
 *          center: median(),
 *        },
 *      }}
 *    />
 * ```
 *
 * The BoxChart supports Info boxes, highlighting and selection.
 *
 * Note: selection and highlighting is on the whole event, not individual ranges.
 * Also note that since the box chart builds an internal TimeSeries for performance
 * reasons, selection will give you and IndexedEvent, but it won't be the same
 * IndexedEvent in your `series`. Similarly if you are using the aggregation
 * specification you will get events for the rollup, not your original data.
 */
export default class BoxChart extends React.Component {
    constructor(props) {
        super(props);
        if (
            props.series._collection._type === TimeEvent // eslint-disable-line
        ) {
            this.series = getAggregatedSeries(props.series, props.column, props.aggregation);
        } else {
            this.series = getSeries(props.series, props.column);
        }
    }

    componentWillReceiveProps(nextProps) {
        const aggregation = nextProps.aggregation;

        let aggregationChanged = false;
        if (_.isUndefined(aggregation) !== _.isUndefined(this.props.aggregation)) {
            aggregationChanged = true;
        }

        if (aggregation && this.props.aggregation) {
            if (aggregation.size !== this.props.aggregation.size) {
                aggregationChanged = true;
            }
        }

        if (aggregationChanged) {
            this.series = getAggregatedSeries(
                nextProps.series,
                nextProps.column,
                nextProps.aggregation
            );
        }
    }

    shouldComponentUpdate(nextProps) {
        const newSeries = nextProps.series;
        const oldSeries = this.props.series;
        const width = nextProps.width;
        const timeScale = nextProps.timeScale;
        const yScale = nextProps.yScale;
        const column = nextProps.column;
        const style = nextProps.style;
        const aggregation = nextProps.aggregation;
        const highlighted = nextProps.highlighted;
        const selected = nextProps.selected;

        const widthChanged = this.props.width !== width;
        const timeScaleChanged = scaleAsString(this.props.timeScale) !== scaleAsString(timeScale);
        const yAxisScaleChanged = this.props.yScale !== yScale;
        const columnChanged = this.props.column !== column;
        const styleChanged = JSON.stringify(this.props.style) !== JSON.stringify(style);
        const highlightedChanged = this.props.highlighted !== highlighted;
        const selectedChanged = this.props.selected !== selected;

        let aggregationChanged = false;
        if (_.isUndefined(aggregation) !== _.isUndefined(this.props.aggregation)) {
            aggregationChanged = true;
        }

        if (aggregation && this.props.aggregation) {
            if (aggregation.size !== this.props.aggregation.size) {
                aggregationChanged = true;
            }
        }

        let seriesChanged = false;
        if (oldSeries.size() !== newSeries.size()) {
            seriesChanged = true;
        } else {
            seriesChanged = !TimeSeries.is(oldSeries, newSeries);
        }

        // If the series changes we need to rebuild this.series with
        // the incoming props
        if (seriesChanged) {
            if (
                nextProps.series._collection._type === TimeEvent // eslint-disable-line
            ) {
                this.series = getAggregatedSeries(
                    nextProps.series,
                    nextProps.column,
                    nextProps.aggregation
                );
            } else {
                this.series = getSeries(nextProps.series, nextProps.column);
            }
        }

        return (
            seriesChanged ||
            timeScaleChanged ||
            widthChanged ||
            columnChanged ||
            styleChanged ||
            yAxisScaleChanged ||
            aggregationChanged ||
            highlightedChanged ||
            selectedChanged
        );
    }

    handleHover(e, event) {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(event);
        }
    }

    handleHoverLeave() {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(null);
        }
    }

    handleClick(e, event) {
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(event);
        }
        e.stopPropagation();
    }

    providedStyleArray(column) {
        let style = {};
        if (this.props.style) {
            if (this.props.style instanceof Styler) {
                style = this.props.style.boxChartStyle()[column];
            } else if (_.isFunction(this.props.style)) {
                style = this.props.style(column);
            } else if (_.isObject(this.props.style)) {
                style = this.props.style ? this.props.style[column] : defaultStyle;
            }
        }
        return style;
    }

    /**
     * Returns the style used for drawing the path
     */
    style(column, event, level) {
        let style;
        if (!this.providedStyle) {
            this.providedStyle = this.providedStyleArray(this.props.column);
        }

        if (
            !_.isNull(this.providedStyle) &&
            (!_.isArray(this.providedStyle) || this.providedStyle.length !== 3)
        ) {
            console.warn("Provided style to BoxChart should be an array of 3 objects");
            return defaultStyle;
        }

        const isHighlighted = this.props.highlighted && Event.is(this.props.highlighted, event);

        const isSelected = this.props.selected && Event.is(this.props.selected, event);

        if (this.props.selected) {
            if (isSelected) {
                if (!this.selectedStyle || !this.selectedStyle[level]) {
                    if (!this.selectedStyle) {
                        this.selectedStyle = [];
                    }
                    this.selectedStyle[level] = merge(
                        true,
                        defaultStyle[level].selected,
                        this.providedStyle[level].selected ? this.providedStyle[level].selected : {}
                    );
                }
                style = this.selectedStyle[level];
            } else if (isHighlighted) {
                if (!this.highlightedStyle || !this.highlightedStyle[level]) {
                    if (!this.highlightedStyle) {
                        this.highlightedStyle = [];
                    }
                    this.highlightedStyle[level] = merge(
                        true,
                        defaultStyle[level].highlighted,
                        this.providedStyle[level].highlighted
                            ? this.providedStyle[level].highlighted
                            : {}
                    );
                }
                style = this.highlightedStyle[level];
            } else {
                if (!this.mutedStyle) {
                    this.mutedStyle = [];
                }
                if (!this.mutedStyle[level]) {
                    this.mutedStyle[level] = merge(
                        true,
                        defaultStyle[level].muted,
                        this.providedStyle[level].muted ? this.providedStyle[level].muted : {}
                    );
                }
                style = this.mutedStyle[level];
            }
        } else if (isHighlighted) {
            style = merge(
                true,
                defaultStyle[level].highlighted,
                this.providedStyle[level].highlighted ? this.providedStyle[level].highlighted : {}
            );
        } else {
            if (!this.normalStyle) {
                this.normalStyle = [];
            }
            if (!this.normalStyle[level]) {
                this.normalStyle[level] = merge(
                    true,
                    defaultStyle[level].normal,
                    this.providedStyle[level].normal ? this.providedStyle[level].normal : {}
                );
            }
            style = this.normalStyle[level];
        }
        return style;
    }

    renderBars() {
        const { timeScale, yScale, column } = this.props;

        const innerSpacing = +this.props.innerSpacing;
        const outerSpacing = +this.props.outerSpacing;
        const innerSize = +this.props.innerSize;
        const outerSize = +this.props.outerSize;

        const bars = [];
        let eventMarker;

        const scaled = (d, field) => {
            return d.has(field) && !_.isUndefined(d.get(field)) && !_.isNaN(d.get(field))
                ? yScale(d.get(field))
                : null;
        };

        for (const event of this.series.events()) {
            const index = event.index();
            const begin = event.begin();
            const end = event.end();
            const d = event.data();

            const beginPosInner = timeScale(begin) + innerSpacing;
            const endPosInner = timeScale(end) - innerSpacing;

            const beginPosOuter = timeScale(begin) + outerSpacing;
            const endPosOuter = timeScale(end) - outerSpacing;

            let innerWidth = innerSize || endPosInner - beginPosInner;
            if (innerWidth < 1) {
                innerWidth = 1;
            }

            let outerWidth = outerSize || endPosOuter - beginPosOuter;
            if (outerWidth < 1) {
                outerWidth = 1;
            }

            const c = timeScale(begin) + (timeScale(end) - timeScale(begin)) / 2;

            let xInner = timeScale(begin) + innerSpacing;
            if (innerSize) {
                xInner = c - innerSize / 2;
            }

            let xOuter = timeScale(begin) + outerSpacing;
            if (outerSize) {
                xOuter = c - outerSize / 2;
            }

            const styles = [];
            styles[0] = this.style(column, event, 0);
            styles[1] = this.style(column, event, 1);
            styles[2] = this.style(column, event, 2);

            const innerMin = scaled(d, "innerMin");
            const innerMax = scaled(d, "innerMax");
            const outerMin = scaled(d, "outerMin");
            const outerMax = scaled(d, "outerMax");
            const center = scaled(d, "center");

            let hasInner = true;
            let hasOuter = true;
            let hasCenter = true;
            if (_.isNull(innerMin) || _.isNull(innerMax)) {
                hasInner = false;
            }
            if (_.isNull(outerMin) || _.isNull(outerMax)) {
                hasOuter = false;
            }
            if (_.isNull(center)) {
                hasCenter = false;
            }

            let ymax = 0;
            if (hasOuter) {
                let level = 0;
                if (!hasInner) {
                    level += 1;
                }
                if (!hasCenter) {
                    level += 1;
                }
                const keyOuter = `${
                    this.series.name() ? this.series.name() : "series"
                }-${index}-outer`;
                const boxOuter = {
                    x: xOuter,
                    y: outerMax,
                    width: outerWidth,
                    height: outerMin - outerMax,
                    rx: 2,
                    ry: 2
                };
                const barOuterProps = {
                    key: keyOuter,
                    ...boxOuter,
                    style: styles[level]
                };

                if (this.props.onSelectionChange) {
                    barOuterProps.onClick = e => this.handleClick(e, event);
                }
                if (this.props.onHighlightChange) {
                    barOuterProps.onMouseMove = e => this.handleHover(e, event);
                    barOuterProps.onMouseLeave = () => this.handleHoverLeave();
                }

                bars.push(<rect {...barOuterProps} />);
                ymax = "outerMax";
            }

            if (hasInner) {
                let level = 1;
                if (!hasCenter) {
                    level += 1;
                }
                const keyInner = `${this.series.name()}-${index}-inner`;
                const boxInner = {
                    x: xInner,
                    y: innerMax,
                    width: innerWidth,
                    height: innerMin - innerMax,
                    rx: 1,
                    ry: 1
                };
                const barInnerProps = {
                    key: keyInner,
                    ...boxInner,
                    style: styles[level]
                };
                if (this.props.onSelectionChange) {
                    barInnerProps.onClick = e => this.handleClick(e, event);
                }
                if (this.props.onHighlightChange) {
                    barInnerProps.onMouseMove = e => this.handleHover(e, event);
                    barInnerProps.onMouseLeave = () => this.handleHoverLeave();
                }

                bars.push(<rect {...barInnerProps} />);
                ymax = ymax || "innerMax";
            }

            if (hasCenter) {
                const level = 2;
                const keyCenter = `${this.series.name()}-${index}-center`;
                const boxCenter = {
                    x: xInner,
                    y: center,
                    width: innerWidth,
                    height: 1
                };
                const barCenterProps = {
                    key: keyCenter,
                    ...boxCenter,
                    style: styles[level]
                };
                if (this.props.onSelectionChange) {
                    barCenterProps.onClick = e => this.handleClick(e, event);
                }
                if (this.props.onHighlightChange) {
                    barCenterProps.onMouseMove = e => this.handleHover(e, event);
                    barCenterProps.onMouseLeave = () => this.handleHoverLeave();
                }
                if (_.isNaN(barCenterProps.y)) {
                    console.log(d.toString());
                }
                bars.push(<rect {...barCenterProps} />);
                ymax = ymax || "center";
            }

            // Event marker if info provided and hovering
            const isHighlighted = this.props.highlighted && Event.is(this.props.highlighted, event);
            if (isHighlighted && this.props.info) {
                eventMarker = (
                    <EventMarker
                        {...this.props}
                        yValueFunc={e => e.get(ymax)}
                        event={event}
                        column={column}
                        marker="circle"
                        markerRadius={2}
                    />
                );
            }
        }

        return (
            <g>
                {bars}
                {eventMarker}
            </g>
        );
    }

    render() {
        return <g>{this.renderBars()}</g>;
    }
}

BoxChart.propTypes = {
    /**
     * Show or hide this chart
     */
    visible: PropTypes.bool,

    /**
     * What [Pond TimeSeries](https://esnet-pondjs.appspot.com/#/timeseries)
     * data to visualize. See general notes on the BoxChart.
     */
    series: (props, propName, componentName) => {
        const value = props[propName];
        if (!(value instanceof TimeSeries)) {
            return new Error(
                `A TimeSeries needs to be passed to ${componentName} as the 'series' prop.`
            );
        }

        // TODO: Better detection of errors

        // everything ok
        return null;
    },

    /**
     * The column within the TimeSeries to plot. Unlike other charts, the BoxChart
     * works on just a single column.
     *
     * NOTE : Columns can't have periods because periods
     * represent a path to deep data in the underlying events
     * (i.e. reference into nested data structures)
     */
    column: PropTypes.string,

    /**
     * The aggregation specification. This object should contain:
     *   - innerMax
     *   - innerMin
     *   - outerMax
     *   - outerMin
     *   - center
     * Though each of the pairs, and center, is optional.
     * For each of these keys you should supply the function you
     * want to use to calculate these. You can import common functions
     * from Pond, e.g. min(), avg(), percentile(95), etc.
     *
     * For example:
     * ```
     *     {
     *       size: this.state.rollup,
     *       reducers: {
     *         outer: [min(), max()],
     *         inner: [percentile(25), percentile(75)],
     *         center: median(),
     *       },
     *     }
     * ```
     */
    aggregation: PropTypes.shape({
        size: PropTypes.string,
        reducers: PropTypes.shape({
            inner: PropTypes.arrayOf(PropTypes.func), // eslint-disable-line
            outer: PropTypes.arrayOf(PropTypes.func), // eslint-disable-line
            center: PropTypes.func // eslint-disable-line
        })
    }), // eslint-disable-line

    /**
     * The style of the box chart drawing (using SVG CSS properties) or
     * a styler object. It is recommended to user the styler unless you need
     * detailed customization.
     */
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.instanceOf(Styler)]),

    /**
     * The style of the info box and connecting lines
     */
    infoStyle: PropTypes.object, //eslint-disable-line

    /**
     * The width of the hover info box
     */
    infoWidth: PropTypes.number, //eslint-disable-line

    /**
     * The height of the hover info box
     */
    infoHeight: PropTypes.number, //eslint-disable-line

    /**
     * The vertical offset in pixels of the EventMarker info box from the
     * top of the chart.
     */
    infoOffsetY: PropTypes.number,

    /**
     * The values to show in the info box. This is an array of
     * objects, with each object specifying the label and value
     * to be shown in the info box.
     */
    info: PropTypes.arrayOf(
        PropTypes.shape({
            //eslint-disable-line
            label: PropTypes.string, //eslint-disable-line
            value: PropTypes.string //eslint-disable-line
        })
    ),

    /**
     * If spacing is specified, then the boxes will be separated from the
     * timerange boundary by this number of pixels. Use this to space out
     * the boxes from each other. Inner and outer boxes are controlled
     * separately.
     */
    innerSpacing: PropTypes.number,

    /**
     * If spacing is specified, then the boxes will be separated from the
     * timerange boundary by this number of pixels. Use this to space out
     * the boxes from each other. Inner and outer boxes are controlled
     * separately.
     */
    outerSpacing: PropTypes.number,

    /**
     * If size is specified, then the innerBox will be this number of pixels wide. This
     * prop takes priority over "spacing".
     */
    innerSize: PropTypes.number,

    /**
     * If size is specified, then the outer box will be this number of pixels wide. This
     * prop takes priority over "spacing".
     */
    outerSize: PropTypes.number,

    /**
     * The selected item, which will be rendered in the "selected" style.
     * If a bar is selected, all other bars will be rendered in the "muted" style.
     *
     * See also `onSelectionChange`
     */
    selected: PropTypes.instanceOf(IndexedEvent),

    /**
     * The highlighted item, which will be rendered in the "highlighted" style.
     *
     * See also `onHighlightChange`
     */
    highlighted: PropTypes.instanceOf(IndexedEvent),

    /**
     * A callback that will be called when the selection changes. It will be called
     * with the event corresponding to the box clicked as its only arg.
     */
    onSelectionChange: PropTypes.func,

    /**
     * A callback that will be called when the hovered over box changes.
     * It will be called with the event corresponding to the box hovered over.
     */
    onHighlightChange: PropTypes.func,

    /**
     * [Internal] The timeScale supplied by the surrounding ChartContainer
     */
    timeScale: PropTypes.func,

    /**
     * [Internal] The yScale supplied by the associated YAxis
     */
    yScale: PropTypes.func,

    /**
     * [Internal] The width supplied by the surrounding ChartContainer
     */
    width: PropTypes.number
};

BoxChart.defaultProps = {
    visible: true,
    column: "value",
    innerSpacing: 1.0,
    outerSpacing: 2.0,
    infoStyle: {
        stroke: "#999",
        fill: "white",
        opacity: 0.9,
        pointerEvents: "none"
    },
    stemStyle: {
        stroke: "#999",
        cursor: "crosshair",
        pointerEvents: "none"
    },
    markerStyle: {
        fill: "#999"
    },
    markerRadius: 2,
    infoWidth: 90,
    infoHeight: 30,
    infoOffsetY: 20
};
