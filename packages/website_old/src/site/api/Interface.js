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

import { headingStyle, textStyle, sigStyle } from "./styles";
import { codeRenderer } from "./renderers";

export default class TsInterface extends Component {
    buildParamList(parameters) {
        return parameters
            ? parameters.map((param, i) => {
                  const paramType = param.type;
                  const paramName = param.name;
                  const paramTypeName = paramType.name;
                  const isArray = paramType.isArray;
                  const isOptional = param.flags.isOptional;
                  const typeArgs = this.buildTypeArguments(paramType.typeArguments);
                  return `${paramName}${isOptional ? "?" : ""}: ${paramTypeName
                      ? paramTypeName
                      : ""}${typeArgs}${isArray ? "[]" : ""}`;
              })
            : [];
    }

    buildReturnType(signature) {
        if (signature.type) {
            const typeName = this.buildType(signature.type);
            const isArray = signature.type.isArray;
            return `${typeName}${isArray ? "[]" : ""}`;
        } else {
            return "";
        }
    }

    buildDeclarations(type, name) {
        const { indexSignature, signatures } = type.declaration;
        if (indexSignature) {
            const mapIndex = indexSignature.map(index => {
                const { parameters, type } = index;
                const paramArray = parameters.map(param => {
                    const paramName = param.name;
                    const paramTypeName = param.type.name;
                    return `${paramName}: ${paramTypeName}`;
                });
                return `${name}: { [${paramArray.join(" ")}]: ${type.name} };\n`;
            });
            return `${mapIndex}`;
        } else {
            const methodSignatures = signatures.map(signature => {
                const parameters = signature.parameters;
                const paramList = this.buildParamList(parameters);
                const returnType = this.buildReturnType(signature);
                const output = `(${paramList.join(", ")}) => ${returnType};\n`;
                return output;
            });
            return methodSignatures;
        }
    }

    buildIndex(indexSignature) {
        const index = indexSignature.map(t => {
            const interfaceParameters = t.parameters.map(param => {
                const name = param.name;
                const type = param.type;
                const typeName = type.name;
                return `${name}: ${typeName}`;
            });
            const type = t.type;
            const name = type.name;
            const typeArgs = this.buildTypeArguments(type.typeArguments);
            return `[${interfaceParameters.join(", ")}]: ${name}${typeArgs}${type.isArray === true
                ? "[]"
                : ""};`;
        });
        return index;
    }

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

    buildUnion(type, name) {
        const typeList = type.types;
        const types = typeList.map(t => {
            return `${t.name}${t.isArray === true ? "[]" : ""}`;
        });
        return `${name}: ${types.join(" | ")};\n`;
    }

    buildChildren(children) {
        const mapChildren = children.map(child => {
            const { name, type, flags, comment } = child;
            let text;
            if (comment) {
                text = comment.shortText;
            }
            if (type.name) {
                return `${name}${flags.isOptional === true ? "?" : ""}: ${type.name}${type.isArray
                    ? "[]"
                    : ""};\n`;
            } else if (type.declaration) {
                return this.buildDeclarations(type, name);
            } else if (type.type === "union") {
                return this.buildUnion(type, name);
            } else {
                return "";
            }
        });
        return mapChildren;
    }

    render() {
        const { name, children, comment, indexSignature } = this.props.interface;
        let shortText, mapChildren; //, longText;
        if (children) {
            shortText = comment ? comment.shortText : "";
            mapChildren = this.buildChildren(children);
        } else {
            if (comment) {
                //const { tags } = comment;
                shortText = comment.shortText ? comment.shortText : "";
                //longText = tags ? tags[0].text : "";
            }
            if (indexSignature) {
                mapChildren = this.buildIndex(indexSignature);
            }
        }
        return (
            <div style={{ marginBottom: 20 }}>
                <h2 style={headingStyle}>
                    <a id={name}>{name}</a>
                </h2>
                <div style={textStyle}>
                    <Markdown source={shortText} renderers={{ Code: codeRenderer }} />
                </div>
                <div style={{ marginTop: 15 }}>
                    <pre style={sigStyle}>
                        <code className="language-typescript">{mapChildren}</code>
                    </pre>
                </div>
            </div>
        );
    }
}
