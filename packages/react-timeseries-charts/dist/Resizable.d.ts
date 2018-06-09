/// <reference types="react" />
import * as React from "react";
export declare type ResizableProps = {};
export declare type ResizableState = {
    width: number;
};
export declare class Resizable extends React.Component<ResizableProps, ResizableState> {
    container: HTMLElement;
    constructor(props: ResizableProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleResize(): void;
    render(): JSX.Element;
}
