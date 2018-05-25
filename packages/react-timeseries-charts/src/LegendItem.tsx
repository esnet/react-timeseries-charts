/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import * as _ from "lodash";
import * as React from "react";
import Flexbox from "flexbox-react";
import { ElementStyle } from "./style";

export enum LegendItemType {
    Swatch = "SWATCH",
    Line = "LINE",
    Dot = "DOT"
}

export type LegendItemProps = {
    itemKey: string;
    type: LegendItemType;
    label: string;
    value: string;
    symbolWidth: number;
    symbolHeight: number;
    symbolStyle: ElementStyle;
    labelStyle: ElementStyle;
    valueStyle: ElementStyle;
    onSelectionChange: (key: string) => any;
    onHighlightChange: (key: string) => any;
};

export class LegendItem extends React.Component<LegendItemProps> {
    handleClick(e: React.MouseEvent<HTMLDivElement>, key: string) {
        e.stopPropagation();
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(key);
        }
    }

    handleHover(e: React.MouseEvent<HTMLDivElement>, key: string) {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(key);
        }
    }

    handleHoverLeave() {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(null);
        }
    }

    renderLine(style: ElementStyle) {
        const { symbolWidth, symbolHeight } = this.props;
        return (
            <svg style={{ float: "left" }} width={symbolWidth} height={symbolHeight}>
                <line
                    style={style as React.CSSProperties}
                    x1={0}
                    y1={Math.round(symbolWidth / 2)}
                    x2={symbolWidth}
                    y2={Math.round(symbolWidth / 2)}
                    stroke="black"
                    strokeWidth="2"
                />
            </svg>
        );
    }

    renderSwatch(style: ElementStyle) {
        const { symbolWidth, symbolHeight } = this.props;
        return (
            <svg style={{ float: "left" }} width={symbolWidth} height={symbolHeight}>
                <rect
                    style={style as React.CSSProperties}
                    x={2}
                    y={2}
                    width={symbolWidth - 4}
                    height={symbolHeight - 4}
                    rx={2}
                    ry={2}
                />
            </svg>
        );
    }

    renderDot(style: ElementStyle) {
        const { symbolWidth, symbolHeight } = this.props;
        return (
            <svg style={{ float: "left" }} width={symbolWidth} height={symbolHeight}>
                {/* <circle
                    style={style as React.CSSProperties}
                    cx={Math.round(symbolWidth / 2)}
                    cy={Math.round(symbolHeight / 2)}
                    r={Math.round(symbolWidth) * 0.75}
                /> */}
                <ellipse
                    style={style as React.CSSProperties}
                    cx={Math.round(symbolWidth / 2) + 2}
                    cy={Math.round(symbolHeight / 2) + 1}
                    rx={Math.round(symbolWidth / 2) - 2}
                    ry={Math.round(symbolHeight / 2) - 2}
                />
            </svg>
        );
    }

    render() {
        const { symbolStyle, labelStyle, valueStyle, itemKey, type } = this.props;
        
        let symbol;
        switch (type.toUpperCase()) {
            case LegendItemType.Swatch:
                symbol = this.renderSwatch(symbolStyle);
                break;
            case LegendItemType.Line:
                symbol = this.renderLine(symbolStyle);
                break;
            case LegendItemType.Dot:
                symbol = this.renderDot(symbolStyle);
                break;
            default:
        }

        // TODO: We shouldn't be adding interactions to a element like this.
        //       The alternative it to put it on a <a> or something?
        
        return (
            <Flexbox flexDirection="column" key={itemKey}>
                <div
                    onClick={e => this.handleClick(e, itemKey)}
                    onMouseMove={e => this.handleHover(e, itemKey)}
                    onMouseLeave={() => this.handleHoverLeave()}
                >
                    <Flexbox flexDirection="row">
                        <Flexbox width="20px">{symbol}</Flexbox>
                        <Flexbox flexDirection="column">
                            <Flexbox>
                                <div style={labelStyle as React.CSSProperties}>{this.props.label}</div>
                            </Flexbox>
                            <Flexbox>
                                <div style={valueStyle as React.CSSProperties}>{this.props.value}</div>
                            </Flexbox>
                        </Flexbox>
                    </Flexbox>
                </div>
            </Flexbox>
        );
    }
}
