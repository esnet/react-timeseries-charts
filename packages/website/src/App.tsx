import * as React from "react";
import Chart from "./Chart";

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <div style={{ width: "100%", height: "300px", margin: 50 }}>
                    <Chart />
                </div>
            </div>
        );
    }
}

export default App;
