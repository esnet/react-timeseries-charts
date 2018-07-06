import * as React from "react";
import { withRouter } from "react-router-dom";

type props = {
    location: string;
};

// tslint:disable-next-line:no-any
class ScrollToTop extends React.Component<props, any> {
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    
    componentWillReceiveProps(prevProps: props) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return <div>{this.props.children}</div>;
    }
}

export default withRouter(ScrollToTop);
