## 3. Styling

---

The charts library can be styled in a number of ways. This guide is intended to give an overview of the different levels at which one can modify the look of components in this library. For more detailed information, also see the styling specific section for each component in the API docs.

### 3.1 Overview

At a high level we try to provide complete flexibility when it comes to elements that visualize data, such as the charts themselves. We also provide some stying to other elements such as axis.

We'll start with a discussion on ways to use styling to visualize data. This primarily concerns the different chart types, but also some additional elements such as the legend.

### 3.2 Data Visualizations

To completely define a chart style, which displays multiple channels of a TimeSeries, though being selected, highlighted and so on, for perhaps an area and an outline, one requires quite a lot of style definition. The library allows you to completely specify the actual CSS as in-line styles for all of this. We'll talk about that first. However, we also provide a `styler` object which can allow you to customize the visual appearance based on the column names and then let it produce some sensible styles for the charts. We'll talk about that further on.

The first level of the definition is to specify a style for each column that you are going to display. If you have a TimeSeries with "in" and "out" traffic values for each time, then you'll probably want to define a style that's uniform across your application for those columns, such as orange for "in" and "blue" for out. Perhaps you also want the "in" to be dashed. We might want the line on a LineChart to be these colors, along with a matching legend.

The second level (i.e. for each column name), is the element itself. This depends on what you are displaying. Some charts, such as a LineChart, only have a path to render, while an AreaChart will have both the area and an outline. You can find details of what is expected at this level for each chart type in the API docs.

The third level is the state that the element is in. This allows the visual appearance to change as the element is hovered over or selected. Our components support four different states that they can be in:

* **normal** - the general appearance of the element
* **selected** - the appearance of the element when selected, which is typically when you have clicked on the element
* **highlighted** - the appearance of the element when highlighted, which is typically when the user has moused over the element
* **muted** - if an element is selected, all other elements are muted

Finally, the forth level is the actual style for that column, for that element, in that state. If it is a line then the CSS you provide will be that for a SVG <path> (`stroke`, `strokeWidth` (not stroke-width), etc.), while if it's an area it will be an SVG area (`fill`, etc.).

If all that sounds like a lot, then you are right, it is. But before we see how to simplify this if you don't need to control every CSS line, here is an example to consolidate the above description:

```js
const color = "steelblue";
const highlightColor = "#5a98cb";
const style = {
    "in": {
        line: {
            normal: {stroke: color, fill: "none", strokeWidth: 1},
            highlighted: {stroke: highlightColor, fill: "none", strokeWidth: 1},
            selected: {stroke: color, fill: "none", strokeWidth: 2},
            muted: {stroke: color, fill: "none", opacity: 0.4, strokeWidth: 1}
        },
        area: {
            normal: {fill: color, stroke: "none", opacity: 0.75},
            highlighted: {fill: highlightColor, stroke: "none", opacity: 0.75},
            selected: {fill: color, stroke: "none", opacity: 0.75},
            muted: {fill: color, stroke: "none", opacity: 0.25}
        }
    },
    "out": {
        ... pretty much the above but with different color ...
    }
}
```

Here you see that for the "in" column we define a style for both the "line" and the "area" of the area chart region. Then we do the same for the "out" column too. For each of these we break that down further with a style for each state. Finally we have the style itself, which in this case, mostly uses the same color but changes the opacity around to give us the visual appearance we want.

Okay, enough of all that. Let's talk about the styler.

### 3.3 The Styler

While it's nice to have complete control, our experience is that typically for a given column we just want to specify a few characteristics to visually identify that element. For a line, we likely just want to set the color, the width and if the line is dashed. Actually, typically we just use the color. As we saw above, we can define almost that entire structure simply out of the color. The rest is boilerplate (assuming we like the look of the opacities chosen). And that is in fact what the styler provides us.

To use a `styler` we start by importing it.

```js
import { styler } from "react-timeseries-charts";
```

Then in constructing an instance of the styler we build a mapping of our column name to those characteristics we just talked about.

The current list of characteristics are:

* `color` - the main color of the element, opacity will be applied by the styler
* `selected` - the selection color. If not specified, `color` will be used
* `width` - the width of line drawing
* `dashed` - display line drawing as a dashed line or not

In this case we'll just map the column (`key`) to a `color` we want:

```js
const trafficStyle = styler([{ key: "in", color: "orange" }, { key: "out", color: "blue" }]);
```

Now we can use the styler instance directly in our `AreaChart`:

```jsx
<AreaChart
        series={series}
        columns={{up: ["in"], down: ["out"]}}
        style={trafficStyle}
        ...
/>
```

What's more, we can use the same style `trafficStyle` in the `Legend`:

```jsx
<Legend
    type="swatch"
    style={trafficStyle}
    categories={[{ key: "in", label: "Into Site" }, { key: "out", label: "Out of site" }]}
/>
```

Under the hood, when a styler is passed into something like an `AreaChart`, the chart will ask the `styler` to provide the style with a call to `styler.areaChartStyle()`. What it provides will actually be of the form we discussed in the first part of this guide, generated for your convenience from the color your gave it. As a result, it would be possible to provide your own styler or subclass the provided one.

And that's pretty much it.

Wait, no it's not.

The Styler has another trick. It also comes with a palette of colors from Color Brewer, so you can just specify the color palette you want by name and it will assign colors to the columns for you.

```js
const schemeName = "GnBu";
const columnNames = ["in", "out"];
const trafficStyle = styler(columnNames, schemeName);
```

For an example of this, see the "Stacked AreaChart" example. For the available scheme names see the color brewer website. Most schemes only have about 9 colors at the most, so this won't really work for 100s of colors.

### 3.4 Event level styling

The above description of how to style charts relates to how all events in a particular column look when rendered. This is appropriate for things like line and area charts. However, for some charts we can get more detailed in our styles.

Consider a ScatterChart. Each dot represents an `Event` within the `TimeSeries`, and possibly we'll want to control the visual appearance of the each dot. For example, maybe the dots should be color coded based on some third variable.

In cases like this you can also provide a hook function to the `style` property. This function will be called for each (event, column) and you can return a style object on a per-element basis.

Here's a trimmed down example of a scatter chart:

```jsx
<ScatterChart
    axis="wind-gust"
    series={series}
    columns={["station1", "station2"]}
    style={(event, column) => ({
        normal: {
            fill: column === "station1" ? "green" : "orange",
            opacity: 0.8
        },
        highlighted: {
            fill: column === "station1" ? "green" : "orange",
            stroke: "none",
            opacity: 1.0
        },
        selected: { fill: "none", stroke: "#2db3d1", opacity: 1.0 },
        muted: {
            stroke: "none",
            opacity: 0.4,
            fill: column === "station1" ? "green" : "orange"
        }
    })}
    info={infoValues}
    radius={(event, column) => (column === "station1" ? 3 : 2)}
/>
```

For the full version of this code, see the Wind scatter example.
