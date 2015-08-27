`charts` (component)
====================

A Charts component is a grouping of charts which will be composited on top of
each other. It does no actual rendering itself, but instead is used for organizing
ChartRow children. There must be one, and only one, Charts grouping within a ChartRow.
All children of a ChartRow, for which there must be at least one, are considered a
chart. They should return an SVG <g> containing their render.

Props
-----

