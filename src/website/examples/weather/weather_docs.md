This example uses three rows to create stacked chart:

    <ChartContainer
        utc={this.state.mode === "utc"}
        timeRange={tempSeries.timerange()}
        showGrid={true}
        showGridPosition="over"
        trackerPosition={this.state.tracker}
        trackerTimeFormat="%X"
        onTrackerChanged={(tracker) => this.setState({tracker})} >
        <ChartRow height="150" >
            <YAxis id="temp" label="Temperature (°F)" labelOffset={-5} style={style.axisStyle("temp")}
                   min={50} max={70} width="80" type="linear" format=",.1f"/>
            <Charts>
                <LineChart
                    axis="temp"
                    series={tempSeries}
                    columns={["temp"]}
                    style={style} />
                <LineChart
                    axis="pressure"
                    series={pressureSeries}
                    columns={["pressure"]}
                    style={style} />
            </Charts>
            <YAxis id="pressure" label="Pressure (in)" labelOffset={5} style={style.axisStyle("pressure")}
                   min={29.5} max={30.0} width="80" type="linear" format=",.1f"/>
        </ChartRow>
        <ChartRow height="150" >
            <YAxis id="wind-gust" label="Wind gust (mph)" labelOffset={-5} style={style.axisStyle("gust")}
                   min={0} max={50} width="80" type="linear" format=",.1f"/>
            <Charts>
                <LineChart
                    axis="wind"
                    series={windSeries}
                    columns={["wind"]}
                    interpolation="curveStepBefore"
                    style={style}/>
                <ScatterChart
                    axis="wind-gust"
                    series={gustSeries}
                    columns={["gust"]}
                    style={style}
                    radius={event => { return event.get("radius"); }}/>
            </Charts>
            <YAxis id="wind" label="Wind (mph)" labelOffset={5} style={{labelColor: scheme.wind}}
                   min={0} max={50} width="80" type="linear" format=",.1f"/>
        </ChartRow>
        <ChartRow height="150">
            <YAxis id="total-rain" label="Total Precipitation (in)" style={style.axisStyle("rainAccum")} labelOffset={-5} min={0} max={rainAccumSeries.max("rainAccum")} width="80" type="linear" format=",.2f"/>
            <Charts>
                <AreaChart
                    axis="rain"
                    series={rainSeries}
                    columns={{up: ["rain"]}}
                    style={style}
                    interpolation="curveBasis"
                    fillOpacity={0.4} />
                <LineChart
                    axis="total-rain"
                    series={rainAccumSeries}
                    columns={["rainAccum"]}
                    style={style} />
            </Charts>
            <YAxis id="rain" label="Precipitation (in)" labelOffset={5} style={style.axisStyle("rain")}
                   min={0} max={rainSeries.max("rain")} width="80" type="linear" format=",.2f"/>
        </ChartRow>
    </ChartContainer>