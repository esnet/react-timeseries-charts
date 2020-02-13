import { create } from "@storybook/theming/create";

export default create({
    base: "light",

    colorPrimary: "gray",
    colorSecondary: "#4ec1e0",

    // UI
    appBg: "#fdfdfd",
    appContentBg: "#ffffff",
    appBorderColor: "grey",
    appBorderRadius: 4,

    brandTitle: "react-timeseries-charts",
    brandUrl: "https://software.es.net",
    brandImage:
        "https://raw.githubusercontent.com/esnet/react-timeseries-charts/master/src/website/packages/charts/logo.png"
});
