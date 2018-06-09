import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class ScrollToTop extends Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    componentWillReceiveProps(prevProps) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return <div>{this.props.children}</div>;
    }
}

export default withRouter(ScrollToTop);
