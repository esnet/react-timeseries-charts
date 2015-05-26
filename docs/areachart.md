`areachart` (component)
=======================

Draws an area chart

Props
-----

### `interpolate`

The d3 interpolation method

type: `string`
defaultValue: `"step-after"`


### `series`

The series list. This is a 2 element array, with the first element
build stacked up and the second element being stacked down. Each
element is itself an array of TimeSeries.

type: `arrayOf[object Object]`


### `style`

The style of the area chart, with format:

 "style": {
     up: ["#448FDD", "#75ACE6", "#A9CBEF", ...],
     down: ["#FD8D0D", "#FDA949", "#FEC686", ...]
 }

 Where each color in the array corresponds to each area stacked
 either up or down.

type: `object`
defaultValue: `{
    up: ["#448FDD", "#75ACE6", "#A9CBEF"],
    down: ["#FD8D0D", "#FDA949", "#FEC686"]
}`


### `transition`

Time in ms to transition the chart when the axis changes scale

type: `number`
defaultValue: `0`

