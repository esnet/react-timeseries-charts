## v0.11.0

**General**

- Overhaul of linting rules and propTypes
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

