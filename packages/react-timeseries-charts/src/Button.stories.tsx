import * as React from "react";

import { storiesOf } from "@storybook/react";
import { Button } from "./Button";
import { wInfo } from "../utils";
import { text, boolean } from "@storybook/addon-knobs/react";

(storiesOf("Components/Button", module) as any).addWithJSX(
  "basic Button",
  wInfo(`
  ### Notes
  This is a button
  ### Usage
  ~~~js
  <Button
    label={'Enroll'}
    disabled={false}
    onClick={() => alert('hello there')}
  />
  ~~~`)(() => (
    <Button
      label={text("label", "Enroll")}
      disabled={boolean("disabled", false)}
      onClick={() => alert("hello there")}
    />
  ))
);