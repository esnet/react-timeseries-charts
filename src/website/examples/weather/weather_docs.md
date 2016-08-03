This example uses three rows to create stacked chart:

    <ChartContainer timeRange={tempSeries.range()}>

        <ChartRow height="150">
            <YAxis id="temp" label="Temperature (°F)" labelOffset={-5} style={{labelColor: scheme.temp}}
                   min={50} max={70} width="60" type="linear" format=",.1f"/>

            <Charts>
                <LineChart axis="temp" series={tempSeries} style={{color: scheme.temp, width: 2}}/>
                <LineChart axis="pressure" series={pressureSeries} style={{color: scheme.pressure, width: 2}}/>
            </Charts>
            <YAxis id="pressure" label="Pressure (in)" labelOffset={5} style={{labelColor: scheme.pressure}}
                   min={29.5} max={30.0} width="100" type="linear" format=",.1f"/>
        </ChartRow>

        <ChartRow height="150">
            <YAxis id="wind-gust" label="Wind gust (mph)" labelOffset={-5} style={{labelColor: scheme.gust}}
                   min={0} max={50} width="100" type="linear" format=",.1f"/>

            <Charts>
                <LineChart axis="wind" series={windSeries} style={{color: scheme.wind, width: 2}}/>
                <ScatterChart axis="wind-gust" series={gustSeries} style={{color: scheme.gust, opacity: 0.5}} />
            </Charts>

            <YAxis id="wind" label="Wind (mph)" labelOffset={5} style={{labelColor: scheme.wind}}
                   min={0} max={50} width="60" type="linear" format=",.1f"/>
        </ChartRow>

        <ChartRow height="150">
            <YAxis id="rain" label="Precipitation (in)" labelOffset={-5} style={{labelColor: scheme.rain}}
                   min={0} max={rainSeries.max()} width="60" type="linear" format=",.2f"/>
            <Charts>
                <AreaChart axis="rain" series={rainSeries} style={{up: [scheme.rain]}} interpolate="basis"/>
                <LineChart axis="total-rain" series={rainAccumSeries} style={{color: scheme.rainAccum, width: 1}} />
            </Charts>
            <YAxis id="total-rain" label="Total Precipitation (in)" labelOffset={5} min={0} max={rainAccumSeries.max()} width="60" type="linear" format=",.2f"/>
        </ChartRow>

    </ChartContainer>