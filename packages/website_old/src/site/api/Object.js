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

import { codeStyle, headingStyle } from "./styles";

export default class TsObject extends Component {
    buildType(type) {
        if (type) {
            const typeArgs = this.buildTypeArguments(type.children);
            const { name, defaultValue } = type;
            if (typeArgs) {
                return `${name}: {${typeArgs}}`;
            } else {
                return `${name}${defaultValue ? `: ${defaultValue}` : ""}`;
            }
        }
    }

    buildTypeArguments(typeArguments) {
        if (typeArguments) {
            const typeArgs = typeArguments.map(t => {
                return this.buildType(t);
            });
            return `${typeArgs.join(", \n")}`;
        }
        return;
    }

    render() {
        const { name, children } = this.props.object;
        const params = this.buildTypeArguments(children);
        return (
            <div style={{ marginBottom: 20 }}>
                <h2 style={headingStyle}>
                    <a id={name}>{name}</a>
                </h2>
                <code style={codeStyle}>{params}</code>
            </div>
        );
    }
}
