import { withInfo } from "@storybook/addon-info";
import wInfoStyle from "../src/styles.json";
export function wInfo (text) {
  return withInfo({ inline: true, source: false, styles: wInfoStyle, text: text });
}