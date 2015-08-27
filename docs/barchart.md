`barchart` (component)
======================

Renders a barchart. This BarChart implementation is a little different
in that it will render onto a time axis, rather than rendering to
specific values. As a result, an Aug 2014 bar will render between the
Aug 2014 tick mark and the Sept 2014 tickmark.

Props
-----

### `offset`

The position of the bar is then offset by this value.

type: `number`
defaultValue: `0`


### `spacing`

The width of each bar is the width determined by the time range - spacing x 2

type: `number`
defaultValue: `1`

