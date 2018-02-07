import * as React from "react";
export declare type ResizableProps = {};
export declare type ResizableState = {
    width: number;
};
export declare class Resizable extends React.Component<{}, ResizableState> {
    container: HTMLElement;
    constructor(props: ResizableProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleResize(): void;
    render(): JSX.Element;
}
