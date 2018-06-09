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
import Prism from "prismjs";

import { headingStyle, textStyle, sigStyle } from "./styles";
import { codeRenderer } from "./renderers";

export default class TsFunction extends Component {
    componentDidMount() {
        Prism.highlightAll();
    }

    componentDidUpdate() {
        Prism.highlightAll();
    }

    buildType(type) {
        if (type) {
            if (type.typeArguments) {
                const typeArgs = this.buildTypeArguments(type.typeArguments);
                return `${type.name}${typeArgs}`;
            } else if (type.elementType) {
                return `${type.elementType.name}`;
            } else {
                return `${type.name}`;
            }
        }
    }

    buildTypeArguments(typeArguments, unionTypes = null, elementType) {
        if (typeArguments) {
            const typeArgs = typeArguments.map(t => {
                return this.buildType(t);
            });
            return `<${typeArgs.join(", ")}>`;
        } else if (unionTypes) {
            const typeArgs = unionTypes.map(t => {
                if (t.typeArguments) {
                    const typeArgs = this.buildTypeArguments(t.typeArguments);
                    return `${t.name}${typeArgs}`;
                } else {
                    if (t.isArray === true) {
                        return `${t.name}[]`;
                    } else {
                        return `${t.name}`;
                    }
                }
            });
            return `${typeArgs.join(" | ")}`;
        } else if (elementType) {
            return `${elementType.name}`;
        }
        return "";
    }
    buildParamList(parameters) {
        return parameters
            ? parameters.map((param, i) => {
                  const paramType = param.type;
                  const paramName = param.name;
                  let paramTypeName = paramType.name;
                  const isArray = paramType.isArray || paramType.type === "array";
                  const isOptional = param.flags.isOptional;
                  const typeArgs = this.buildTypeArguments(
                      paramType.typeArguments,
                      paramType.types,
                      paramType.elementType
                  );

                  const defaultValue = param.defaultValue;
                  if (paramTypeName === "(Anonymous function)") {
                      paramTypeName = defaultValue;
                  }
                  return `${paramName}${isOptional || defaultValue ? "?" : ""}: ${paramTypeName
                      ? paramTypeName
                      : ""}${typeArgs}${isArray ? "[]" : ""}`;
              })
            : [];
    }
    buildReturnType(signature) {
        if (signature.type) {
            const typeName = this.buildType(signature.type);
            let isArray = false;
            if (signature.type.isArray !== undefined) {
                isArray = signature.type.isArray;
            } else if (signature.type.elementType) {
                isArray = signature.type.type === "array";
            }
            return `${typeName}${isArray ? "[]" : ""}`;
        } else {
            return "";
        }
    }
    buildFunctionSignatures(signatures) {
        const methodSignatures = signatures.map((signature, i) => {
            const parameters = signature.parameters;
            const paramList = this.buildParamList(parameters);
            const returnType = this.buildReturnType(signature);
            const output = `${signature.name}(${paramList.join(", ")}): ${returnType}`;
            return (
                <div key={i} style={{ marginTop: 15 }}>
                    <pre style={sigStyle}>
                        <code className="language-typescript">{output}</code>
                    </pre>
                </div>
            );
        });
        return methodSignatures;
    }
    renderShortComment(signatures) {
        const { comment } = signatures[0];
        return comment ? (
            <div style={textStyle}>
                <Markdown source={comment.shortText} renderers={{ Code: codeRenderer }} />
            </div>
        ) : (
            <div />
        );
    }
    renderDiscussion(signatures) {
        const { comment } = signatures[0];
        if (comment && comment.text) {
            const { text } = comment;
            return (
                <div>
                    <h4 style={textStyle}>DISCUSSION</h4>
                    <Markdown source={text} renderers={{ Code: codeRenderer }} />
                </div>
            );
        } else {
            return <div />;
        }
    }
    render() {
        const { name, signatures } = this.props.function;
        const functionSignatureList = this.buildFunctionSignatures(signatures);
        return (
            <div style={{ marginBottom: 20 }}>
                <h2 style={headingStyle}>
                    <a id={name}>{name}()</a>
                </h2>
                <div style={textStyle}>{this.renderShortComment(signatures)}</div>
                <div>{functionSignatureList}</div>
                <div style={textStyle}>{this.renderDiscussion(signatures)}</div>
            </div>
        );
    }
}
