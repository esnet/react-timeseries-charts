import * as React from "react";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from 'react-router';

// tslint:disable:no-any
class ScrollToTop extends React.Component<any, any> {
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    
    componentWillReceiveProps(prevProps: RouteComponentProps<any>) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return <div>{this.props.children}</div>;
    }
}

export default withRouter(ScrollToTop);
