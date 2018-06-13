/**
 *  Copyright (c) 2017, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React, { Component } from "react";
import _ from "lodash";

import TsClass from "./Class";
import TsType from "./Type";

export default class TsModule extends Component {
    renderChild(child, i) {
        switch (child.kindString) {
            case "Class":
                return <TsClass key={i} class={child} />;
            case "Type alias":
                const moduleProps = child.name.toLowerCase().includes(this.props.name);
                const props = child.name.includes("Props");
                if (props && moduleProps ) { return <TsType key={i} type={child} />; }
                else { break; }
            default:
                return <div key={i} />;
        }
    }

    render() {
        const { children } = this.props.module;
        const sortedChildren = children.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} ); 
        return (
            <div>
                {sortedChildren ? _.map(sortedChildren, (child, i) => this.renderChild(child, i)) : <div />}
            </div>
        );
    }
}
