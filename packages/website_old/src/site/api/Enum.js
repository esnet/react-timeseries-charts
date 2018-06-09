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
import Markdown from "react-markdown";

import { codeStyle, headingStyle, textStyle } from "./styles";
import { codeRenderer } from "./renderers";

export default class TsEnum extends Component {
    renderShortComment() {
        const { comment } = this.props.enum;
        return comment ? (
            <div style={textStyle}>
                <Markdown source={comment.shortText} renderers={{ Code: codeRenderer }} />
            </div>
        ) : (
            <div style={textStyle} />
        );
    }

    renderParams() {
        const { children } = this.props.enum;
        const params = children.map(child => {
            const { name, defaultValue } = child;
            if (defaultValue) {
                return `${name} = ${defaultValue}`;
            } else {
                return `${name}`;
            }
        });
        return `enum ${this.props.enum.name} { ${params.join("\n")} }`;
    }

    render() {
        const { name, children } = this.props.enum;
        if (children) {
            return (
                <div style={{ marginBottom: 20 }}>
                    <h2 style={headingStyle}>
                        {name}
                    </h2>
                    {this.renderShortComment()}
                    <code style={codeStyle}>{this.renderParams()}</code>
                </div>
            );
        }
    }
}
