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

import { sigStyle } from "./styles";

export default class TsSignatureList extends Component {
    buildType(type) {
        if (type) {
            const typeArgs = this.buildTypeArguments(type.typeArguments, type.types);
            return `${type.name ? type.name : ""}${typeArgs}`;
        }
    }

    buildTypeArguments(typeArguments, unionTypes = null, declaration = null) {
        if (typeArguments) {
            const typeArgs = typeArguments.map(t => {
                return this.buildType(t);
            });
            return `<${typeArgs.join(", ")}>`;
        } else if (unionTypes) {
            const types = unionTypes.map(t => {
                const typeArgs = this.buildTypeArguments(t.typeArguments);
                const isArray = (t.isArray || t.type === "array") ? true : false;
                let elementType;
                if(t.elementType) {
                    elementType = t.elementType.name;
                    return `${elementType}${isArray ? "[]" : ""}`;
                } else {
                    return `${t.name}${typeArgs}${isArray ? "[]" : ""}`;
                }
            });
            return `${types.join(" | ")}`;
        } else if (declaration) {
            const { signatures } = declaration;
            const methodSignatures = signatures.map(signature => {
                const parameters = signature.parameters;
                const paramList = this.buildParamList(parameters);
                const returnType = this.buildReturnType(signature);
                const output = `(${paramList.join(", ")}) => ${returnType}`;
                return output;
            });
            return methodSignatures;
        }
        return "";
    }

    buildParamList(parameters) {
        return parameters
            ? parameters.map((param, i) => {
                  const paramType = param.type;
                  const paramName = param.name;
                  const paramTypeName = paramType.name;
                  const isArray = paramType.isArray;
                  const defaultValue = param.defaultValue ? true : false;
                  const isUnion = paramType.type === "union";
                  // const isOptional = param.flags.isOptional ? true : false;
                  const typeArgs = this.buildTypeArguments(
                      paramType.typeArguments,
                      paramType.types,
                      paramType.declaration
                  );

                  return `${paramName}${defaultValue || isUnion ? "?" : ""}: ${paramTypeName
                      ? paramTypeName
                      : ""}${typeArgs}${isArray ? "[]" : ""}`;
              })
            : [];
    }

    buildRType(signature) {
        const typeName = this.buildType(signature.type);
        // const typeArgs = this.buildTypeArguments(signature.typeParameter);
        const isArray = signature.type.isArray;
        return `${typeName}${isArray ? "[]" : ""}`;
    }

    buildReturnType(signature) {
        if (signature.type) {
            switch (signature.type.type) {
                case "instrinct":
                    return this.buildRType(signature);
                case "reference":
                    return this.buildRType(signature);
                case "reflection":
                    const { indexSignature, signatures } = signature.type.declaration;
                    if (indexSignature) {
                        const mapIndex = indexSignature.map(index => {
                            const { parameters, type } = index;
                            const paramArray = parameters.map(param => {
                                const paramName = param.name;
                                const paramTypeName = param.type.name;
                                return `${paramName}: ${paramTypeName}`;
                            });
                            const isArray = type.isArray ? true : false;
                            return `{ [${paramArray.join(" ")}]: ${type.name}${isArray
                                ? "[]"
                                : ""} };\n`;
                        });
                        return `${mapIndex}`;
                    } else if (signatures) {
                        const methodSignatures = signatures.map(signature => {
                            const parameters = signature.parameters;
                            const paramList = this.buildParamList(parameters);
                            const returnType = this.buildReturnType(signature);
                            const output = `(${paramList.join(", ")}) => ${returnType}`;
                            return output;
                        });
                        return methodSignatures;
                    } else {
                        return;
                    }
                case "array":
                    return `${signature.type.elementType.name}[]`;
                default:
                    return this.buildRType(signature);
            }
        } else {
            return "";
        }
    }

    buildTypeParameter(typeParameter) {
        if (typeParameter && typeParameter.length) {
            const typeParameters = typeParameter.map(t => {
                if (t.type) {
                    const type = t.type.name;
                    return `${t.name} extends ${type}`;
                } else {
                    return `${t.name}`;
                }
            });
            return `<${typeParameters.join(", ")}>`;
        } else {
            return "";
        }
    }

    render() {
        const { signatures } = this.props;
        let methodSignatures;
        if (signatures) {
            methodSignatures = signatures.map((signature, k) => {
                const parameters = signature.parameters;
                const paramList = this.buildParamList(parameters);
                const returnType = this.buildReturnType(signature);
                const typeParameter = this.buildTypeParameter(signature.typeParameter);

                const output = `${signature.name}${typeParameter}(${paramList.join(", ")}): ${returnType}`;
                return (
                    <div key={k} style={{ marginTop: 15 }}>
                        <pre style={sigStyle}>
                            <code className="language-typescript">{output}</code>
                        </pre>
                    </div>
                );
            });
        }
        return <div>{methodSignatures}</div>;
    }
}
