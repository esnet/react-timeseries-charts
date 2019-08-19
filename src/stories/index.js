import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { Button, Welcome } from "@storybook/react/demo";
import Label from "../components/Label";

storiesOf("Welcome", module).add("to Storybook", () => <Welcome showApp={linkTo("Button")} />);

storiesOf("Labels", module)
    .add("a basic label", () => (
        <svg width={500} height={500}>
            <Label label="My basic label" width={200} height={30} />
        </svg>
    ))
    .add("a left aligned label", () => (
        <svg width={500} height={500}>
            <Label label="My centered label" width={200} height={30} align="left" />
        </svg>
    ))
    .add("a label with custom box style", () => (
        <svg width={500} height={500}>
            <Label
                label="My label"
                width={200}
                height={30}
                align="left"
                style={{ box: { fill: "#FEFEFE", stroke: "steelblue" } }}
            />
        </svg>
    ))
    .add("a label with custom label style", () => (
        <svg width={500} height={500}>
            <Label
                label="My label"
                width={200}
                height={30}
                align="left"
                style={{
                    box: { fill: "#FEFEFE", stroke: "steelblue" },
                    label: { fontSize: 14, fill: "steelblue" }
                }}
            />
        </svg>
    ))
    .add("a label with rounded corner box ", () => (
        <div style={{ margin: 10 }}>
            <svg width={500} height={500}>
                <g transform="translate(10 10)">
                    <Label
                        label="My centered label"
                        width={200}
                        height={35}
                        rx={5}
                        style={{
                            box: { fill: "#5f5f5f", stroke: "#232323", strokeWidth: 2 },
                            label: { fontSize: 16, fill: "#e0e0e0", fontFamily: "monospace" }
                        }}
                        align="center"
                    />
                </g>
            </svg>
        </div>
    ));
