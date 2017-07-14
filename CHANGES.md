# Changelog

## v0.12.6
> July 14, 2017

 * Improves formatting option to the time axis, it can either be a d3 time format string or a callback function (#86, #164)
 * Cleanup of formatting code, and mirror change into the TimeTracker code so that it works the same. (#164).
 * Fixes the undefined time that would sometimes be seen above the tracker info box (#147)
 * Fixes issue where the format specified on the ChartContainer would become stale (#140)
 * Fixes problem when the brush would get stuck if fully expanded (#141)
 * Adds ability to control the tick size (#150)
 * Docs provide link to source code for examples (#133)

## v0.12.5
> Jun 15, 2017

 * Fixes React propType warnings by using prop-types package ([@aruntk](https://github.com/aruntka) in [#152](https://github.com/esnet/react-timeseries-charts/pull/152))
 * Fixes an issue with ScatterChart prop type ([@christian-acuna](https://github.com/christian-acuna) in [#155](https://github.com/esnet/react-timeseries-charts/pull/155))
 * Pointer events allowing on ScatterChart ([@samford100](https://github.com/samford100) in [#137](https://github.com/esnet/react-timeseries-charts/pull/137))

## v0.12.3
> Feb 24, 2017

 * Fixes issue where the `BoxChart` is not re-rendering on `TimeSeries` change ([#126](https://github.com/esnet/react-timeseries-charts/pull/126)))

## v0.12.1
> Feb 24, 2017

 * Fixed default color for BoxChart infoBox

## v0.12.0
> Feb 23, 2017

**Dependency updates:**
 * Update to latest version of d3 dependencies (i.e. v1.0 releases)
 * Updates peer dependency to Pond 0.8.x. If you use Pond directly, especially events, there are some breaking changes in this version. Of particular note: `new Event()` is likely now `new TimeEvent()`. Static methods are still on the base class `Event`, however.

**Enhancements and API changes**
 * `EventMarker`s now support a simple label attached to the marker, in addition to the flag style marker seen in the tracker. This allows some new options for annotations.

![markers](https://cloud.githubusercontent.com/assets/1288813/23275412/4c24c3b0-f9bb-11e6-9ca6-d45a44f7613f.gif)

 * Charts no longer need a corresponding axis if you pass in the `yScale` directly (or if the chart doesn't need a y scale at all). This is nice for overlaying errors, or making an `EventChart` without having to create a bogus y-scale.
 * Change to `Legend` to clean up that code: props `width` and `height` are now `symbolWidth` and `symbolHeight`, which is clearer about what they do.
 * `EventMarker` `infoStyle` (and use within `BarCharts` and `ScatterCharts`) is broken into `infoStyle` (for the infoBox), `stemStyle` and `markerStyle`.
 * `LineCharts` or `ScatterChart` of `IndexedEvent`s or `TimeRangeEvent`s plot points in the center of their time range, not the beginning as they did before. This way markers do not have to take this into account.

**Bug fixes:**
 * Disable all mouse pan/zoom related event handling when `enablePanZoom=false` ([#121](https://github.com/esnet/react-timeseries-charts/pull/121)) and [#96](https://github.com/esnet/react-timeseries-charts/pull/96)))
 * Fixes bug resulting in stale format in `TimeAxis` (Fixes [#128](https://github.com/esnet/react-timeseries-charts/pull/128)))
 * Missing propType in `YAxis`

**Website changes:**
 * Adds babel-polyfill import to the examples page for IE support (untested) (Fixes [#111](https://github.com/esnet/react-timeseries-charts/pull/111)))
 * `BarChart` docs improvements: new simple example and better explanation of `IndexedEvent` requirement in API docs. ([#125](https://github.com/esnet/react-timeseries-charts/pull/125)))
 
<img width="1090" alt="screen shot 2017-02-23 at 11 24 19 am" src="https://cloud.githubusercontent.com/assets/1288813/23275473/809f3fda-f9bb-11e6-8060-5ade2eb58d20.png">

## v0.11.3
> Feb 6, 2017

- Fixes `infoTimeFormat` prop to work with BarCharts, so you can now format an IndexedEvent (#120)
- Fixes missing curveMonotone curve type (now curveMonotoneX and curveMonotoneY) since the d3 API changed (#114)

## v0.11.1
> Dec 1, 2016

- Fixes bad proptype in TimeRangeMarker (#107)

## v0.11.0
> Nov 30, 2016

**New**

- Adds a BoxChart chart. This is the first chart to enable automatic aggregations. More to come.
- Adds a BoxChart example showing temperature ranges in NYC
- Adds a BoxChart example to the existing cycling example, which shows how to do roll-ups directly on a TimeSeries to produce the summary BoxChart
- Adds an example showing NASA global temperature data

**Enhancements**

- BarChart: Support for negative values ([@jverhoeven](https://github.com/jverhoeven) in [#95](https://github.com/esnet/react-timeseries-charts/pull/95))
- EventChart: Can now set text label position and hover marker width ([@primozs](https://github.com/primozs) in [#104](https://github.com/esnet/react-timeseries-charts/pull/104))
- EventChart: Separate events for hover: onMouseOver and onMouseLeave replace onMouseMove ([@primozs](https://github.com/primozs) in [#104](https://github.com/esnet/react-timeseries-charts/pull/104))
- Brush: Adds a callback for `onTimeRangeSelectComplete` ([@viky293](https://github.com/viky293) in [#91](https://github.com/esnet/react-timeseries-charts/pull/91))

**Bug fixes**

- EventChart: Fixes errors on pan/zoom ([@primozs](https://github.com/primozs) in [#102](https://github.com/esnet/react-timeseries-charts/pull/102))
- Styler now correctly falls back to defaults for LineCharts, BarCharts and ScatterCharts ([@siavelis](https://github.com/siavelis) in [#103](https://github.com/esnet/react-timeseries-charts/pull/103))

**General**

- Removes the HorizontalBarChart, which now lives at react-timeseries-barchart to keep the library better focused
- Overhaul of linting rules. Uses AirBnB, almost. But not all examples are converted yet :(
- More complete use of propTypes
- Better API docs

## v0.10.1
> Sep 15, 2016

- Fix AreaChart default style (#79)

## v0.10.0
> Sep 13, 2016

**General**

- The main theme of this release is styling improvements (#57), and this presents the only significant breaking change. Pretty much all styles have at least changed format. Additionally there's a `styler` object that can simplify defining styles across the API. See the [Styling Guide](https://github.com/esnet/react-timeseries-charts/blob/master/src/website/guides/style.md).
- Overhaul of overlay markers. See the [Marker Guide](https://github.com/esnet/react-timeseries-charts/blob/master/src/website/guides/markers.md).
- Selection and highlighting supported across the API.
- Pond v0.7 is now a peer dependency.
- React 15 and 0.14 are now both supported.
- Support for UTC time axis scales.
- Overhaul of example pages (now build on create-react-app).

**Bugfixes**
- Handle background selection clearing on the EventHandler rather than in the Scatter and BarChart code, so that these charts can be overlaid on top of each other without stealing each other's events.
- Fixes use of array fill for older browsers (#71)
- Fixes bad YAxis animations that sometimes finished in the wrong place (#77)

## v0.9.2
> Jul 6, 2016

- **Bugfix:** Fixes a bug where the LineChart wouldn't render if the
breakLines prop was set to false (#65)

## v0.9.1
> Jun 29, 2016

- **Bugfix:** Update LineChart when the columns prop changes (#63)

## v0.9.0
> Jun 19, 2016

**New:**
- Adds horizontal bar charts to compare a list of TimeSeries
- Channel display of data using LabelAxis and ValueAxis (see cycling example)

**General:**
- Ability to show grid markers for the time axis. Add the prop `showGrid={true}` to the `<ChartContainer>`.
- Changed event handling to be on top of the whole SVG charts area, rather than per row. This allows you to drag on the timeline or interact across rows. Drag now works if you drag off the SVG area, though it's slow on Chrome for some reason. But at least it doesn't interrupt the drag.
- Better y-scale transitions. Transition time prop should now be specified on the YAxis itself rather than the ChartContainer.
- Uses Pond 0.6.x, now specified as a peer dependency, so bring your own pondjs.

**AreaChart:**
- Now supports full d3 interpolation set
- Now supports outlining of the areas

**LineChart:**
- LineCharts are now implemented with d3 paths
- Supports full interpolation set d3 offers
- Line charts can now display multiple columns as separate paths using the `columns` prop.
- Styling has changed to allow styling of the multiple paths and will accept a full CSS like object so you have complete control over the styling.

**Legends:**
 - Expanded styling API lets you customize the swatch, dot or line
 - Now supports showing value under the legend label using "value" within the properties
 - Legends are now built with SVG rather than CSS applied to an element. This means the style required to make it work has also changed. Specifically, where you might have had `{backgroundColor: "red"}`, and you have a swatch, that would now be `{fill: "red"}` while if you have a line type legend item, that would be `{stroke: "red"}`. This enables complete control, but this breaks existing legends.

**Baselines:**
- Styling for baselines. Use the `style` prop. See the baseline example for what
this style should look like.

**Trackers and tooltips:**
- The general charts tracker can now show the time, along with value properties under it
- Specialized tooltip display for scatter charts

**Internal:**
- Uses of broken apart d3 4.0 modules.
- Brush is now implemented entirely in React, no more d3-brush
- New component to display a list of (key, value) pairs in SVG is used for the LabelAxis and tooltips now
- React based rendering for AreaChart and ScatterChart now

## v0.8.1
> Feb 10, 2016

- **Bugfix:** Export Brush

## v0.8.0
> Feb 10, 2016

- Adds d3 brush and examples

## v0.7.0
> Jan 13, 2016

- Legend items can be enabled/disabled
- Removes Bootstrap as a dependency. Entire chart row structure is one SVG object now.
- Removed chart container css file, as it isn't needed anymore.
- Added propTypes to ChartContainer.
- Added tracker to ChartContainer rather than ChartRow so that it can be drawn across all rows at the same time.
- Auto-generated docs.
- Fixed some update issues when the width of the chart changed.
- Fixed propTypes for the Table.

## v0.6.0
> Dec 4, 2015

- Ability to have LineCharts break their line at bad values, or simply filter out those points. Fixes #30.
- Ability to display a 'relative' time axis (0:00, 0:15, 0:30, 1hr, 1:15, ...). See screenshot below. Fixed #33.
- Optimized updating of LineCharts (implements shouldComponentUpdate() now). Fixes #34.

## v0.5.1
> Nov 24, 2015

- React 0.14

