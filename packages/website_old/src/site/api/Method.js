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

import SignatureList from "./Signature";

import { codeRenderer, codeBlockRenderer } from "./renderers";
import { textStyle, methodHeadingStyle } from "./styles";

export default class TsMethod extends Component {
    renderComment(signature) {
        if (signature.comment) {
            const { shortText, tags, text } = signature.comment;
            let additionalText;
            if (tags) {
                additionalText = tags.map(t => {
                    return `${t.text}`;
                });
            }
            return (
                <div style={textStyle}>
                    <Markdown
                        source={shortText ? shortText : ""}
                        renderers={{ Code: codeRenderer, CodeBlock: codeBlockRenderer }}
                    />
                    <Markdown
                        source={additionalText ? additionalText.join("\n") : ""}
                        renderers={{ Code: codeRenderer, CodeBlock: codeBlockRenderer }}
                    />
                    <Markdown
                        source={text ? text : ""}
                        renderers={{ Code: codeRenderer, CodeBlock: codeBlockRenderer }}
                    />
                </div>
            );
        } else {
            return <div />;
        }
    }

    renderMethodSignatures() {
        return <SignatureList signatures={this.props.entity.signatures} />;
    }

    render() {
        const { name, signatures } = this.props.entity;
        const title = this.props.title ? this.props.title : name;
        const first = signatures[0];
        return (
            <div style={{ marginBottom: 20, marginTop: 50 }}>
                <a style={methodHeadingStyle} href={`#${name}`}>
                    {title}
                </a>
                {this.renderMethodSignatures()}
                <div style={{ padding: 10 }} />
                {this.renderComment(first)}
            </div>
        );
    }
}
