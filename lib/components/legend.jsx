/*
 * ESnet React Charts, Copyright (c) 2014, The Regents of the University of
 * California, through Lawrence Berkeley National Laboratory (subject
 * to receipt of any required approvals from the U.S. Dept. of
 * Energy).  All rights reserved.
 *
 * If you have questions about your rights to use or distribute this
 * software, please contact Berkeley Lab's Technology Transfer
 * Department at TTD@lbl.gov.
 *
 * NOTICE.  This software is owned by the U.S. Department of Energy.
 * As such, the U.S. Government has been granted for itself and others
 * acting on its behalf a paid-up, nonexclusive, irrevocable,
 * worldwide license in the Software to reproduce, prepare derivative
 * works, and perform publicly and display publicly.  Beginning five
 * (5) years after the date permission to assert copyright is obtained
 * from the U.S. Department of Energy, and subject to any subsequent
 * five (5) year renewals, the U.S. Government is granted for itself
 * and others acting on its behalf a paid-up, nonexclusive,
 * irrevocable, worldwide license in the Software to reproduce,
 * prepare derivative works, distribute copies to the public, perform
 * publicly and display publicly, and to permit others to do so.
 *
 * This code is distributed under a BSD style license, see the LICENSE
 * file for complete information.
 */
 
import React from "react/addons";
import _ from "underscore";
var merge = require('merge')

export default React.createClass({

    displayName: "Legend",

    getDefaultProps: function() {
        return {
            "style": {},
            "labelStyle": {},
            "type": "swatch", //or "line" or "dot"
        };
    },

    render: function() {

        const legendStyle = {
            listStyle: "none",
            paddingLeft: 0
        }

        const legendListStyle = {
            float: "left",
            marginRight: 10
        }

        const swatchStyle = {
            float: "left",
            width: 15,
            height: 15,
            margin: 2,
            borderRadius: 2,
            backgroundColor: "#CCC"
        }

        const lineStyle = {
            float: "left",
            width: 15,
            height: 3,
            margin: 2,
            marginTop: 8,
            backgroundColor: "#CCC"
        }

        const dotStyle = {
            float: "left",
            width: 8,
            height: 8,
            margin: 2,
            marginTop: 6,
            borderRadius: 4,
            backgroundColor: "#CCC"
        }

        const labelStyle = {
        }


        let items = [];
        _.each(this.props.categories, (category) => {
            let style;
            let categoryStyle = category.style || {};
            let categoryLabelStyle = category.labelStyle || {};
            if (this.props.type === "swatch") {
                style = merge(true, swatchStyle, categoryStyle);
            } else if (this.props.type === "line") {
                style = merge(true, lineStyle, categoryStyle);
            } else if (this.props.type === "dot") {
                style = merge(true, dotStyle, categoryStyle);
            }

            const labelStyle = merge(true, labelStyle, categoryLabelStyle);

            items.push(
                <li key={"legend-item-" + category.key} style={legendListStyle}>
                    <span style={style}/>
                    <span style={labelStyle}> {category.label} </span>
                </li>
            );
        });

        return (
            <ul style={legendStyle}>{items}</ul>
        );
    }
});
