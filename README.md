This repository contains a set of modular React components for building flexible interactive charts, built using d3 and React.

The code is based on the original ESnet Portal chart components.  The sources in lib/components was copied from the corresponding files from myesnet/static/js/portal/components in the esnet-portal project under tag 'dev-esnet-react-charts-snap-2014-08-10'.

This repository doesn't currently build a standalone library component.  Instead it provides a top-level file [esnet-react-charts.js](./esnet-react-charts.js), that can be used (via require) in any webpack project (after npm installing this repository).

