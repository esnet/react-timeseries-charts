/**
 *  Copyright (c) 2017, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import * as _ from "lodash";
import * as React from "react";
import { codeStyle } from "./styles";

// tslint:disable:no-any
interface CodeRendererProps {
    literal: any;
}

export function codeRenderer(props: CodeRendererProps) {
    const availableLinks = [];
    return _.includes(availableLinks, props.literal) ? (
        <a href={props.literal}>
            <code style={codeStyle}>{props.literal}</code>
        </a>
    ) : (
        <code style={codeStyle}>{props.literal}</code>
    );
}

export function codeBlockRenderer(props: CodeRendererProps) {
    return (
        <pre style={{ marginTop: 10, padding: 5, background: "#fafafa", borderStyle: "none" }}>
            <code className="language-typescript">{props.literal}</code>
        </pre>
    );
}