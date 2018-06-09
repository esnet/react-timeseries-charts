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

import { codeStyle } from "./styles";

export default class TsProperty extends Component {
    buildType(type) {
        if (type) {
            const typeArgs = this.buildTypeArguments(type.typeArguments);
            return `${type.name}${typeArgs}`;
        }
    }

    buildTypeArguments(typeArguments) {
        if (typeArguments) {
            const typeArgs = typeArguments.map(t => {
                return this.buildType(t);
            });
            return `<${typeArgs.join(", ")}>`;
        }
        return "";
    }

    render() {
        const { name, type } = this.props.entity;
        const { typeArguments, types, isArray } = type;
        if (typeArguments) {
            const returnType = this.buildTypeArguments(typeArguments);
            return <code style={codeStyle}>{`${name}: ${type.name} ${returnType}`}</code>;
        } else if (types) {
            const allTypes = types.map(t => {
                return `${t.name}`;
            });
            return <code style={codeStyle}>{`${name}: ${allTypes.join(" | ")}`}</code>;
        } else {
            return <code style={codeStyle}>{`${name}: ${type.name}${isArray ? "[]" : ""}`}</code>;
        }
    }
}
