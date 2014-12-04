This repository contains a set of modular React components for building flexible interactive charts, built using d3 and React.

Usage
-----

This repository doesn't currently build a standalone library component.  Instead it provides a top-level file [esnet-react-charts.js](./esnet-react-charts.js), that can be used (via require) in any webpack project (after npm installing this repository).

Examples
--------

To run the examples you first need to run:

```npm install```

This will install the development dependencies into your node_modules directory.

You can then start up the test server, as well as automatic source building, by doing:

```npm start```

And now, for the magic, point your browser to:

http://localhost:8080/webpack-dev-server/

From now on, if you change the source code, webpack will rebuild the examples bundle and the browser will refresh itself. Errors will also be reported in the browser window.

Copyright
---------

ESnet React Charts, Copyright (c) 2014, The Regents of the University of California, through Lawrence Berkeley National Laboratory (subject to receipt of any required approvals from the U.S. Dept. of Energy). All rights reserved.

If you have questions about your rights to use or distribute this software, please contact Berkeley Lab's Technology Transfer Department at TTD@lbl.gov.

NOTICE. This software is owned by the U.S. Department of Energy. As such, the U.S. Government has been granted for itself and others acting on its behalf a paid-up, nonexclusive, irrevocable, worldwide license in the Software to reproduce, prepare derivative works, and perform publicly and display publicly. Beginning five (5) years after the date permission to assert copyright is obtained from the U.S. Department of Energy, and subject to any subsequent five (5) year renewals, the U.S. Government is granted for itself and others acting on its behalf a paid-up, nonexclusive, irrevocable, worldwide license in the Software to reproduce, prepare derivative works, distribute copies to the public, perform publicly and display publicly, and to permit others to do so.

This code is distributed under a BSD style license, see the LICENSE file for complete information.
