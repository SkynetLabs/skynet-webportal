/** @jsx jsx */
import { jsx } from "theme-ui"
import { Container } from "@material-ui/core";

// React Grid System
import { Row, Col } from 'react-grid-system';

// D3 / Recharts charts library
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Text, ResponsiveContainer} from 'recharts';

// Font Awesome
import { faThumbtack, faUpload, faDownload, faServer, faStopwatch, faMoneyBillAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { theme } from "../../theme/theme";
import { icon } from "@fortawesome/fontawesome-svg-core";


export const Dashboard = (props) => {

    const stats = props.api

    return (<div style={{ width: "100%", paddingTop: 50}}>
        <Container>
            <Row justify="between">
                <StatBox title="Pinned files" icon={faThumbtack} iconTransform="rotate-45" stat={stats.total_files_pinned} suffix=""/>
                <StatBox title="Stored data" icon={faServer} iconTransform="" stat="0.145" suffix="TB"/>
                <StatBox title="Files served this week" icon={faUpload} iconTransform="" stat={stats.total_files_served[168]} suffix=""/>
            </Row>

            <Row style={{padding: 3, border: '2px solid ' + theme.colors.statsElementsBorder, borderRadius: "15px", justifyContent: 'center', textAlign: 'center', marginBottom: 50, paddingBottom: 40}}>
                <Container>
                    <Row>
                        <Col xs={12} md={6}>
                            <StatBarChart title="Time to first byte" units="milliseconds" icon={faStopwatch}
                                data={[
                                    {name: 'Last Hour', p80: stats.ttfb["p80-1"], p95: stats.ttfb["p95-1"], p99: stats.ttfb["p99-1"]},
                                    {name: 'Last Day', p80: stats.ttfb["p80-24"], p95: stats.ttfb["p95-24"], p99: stats.ttfb["p99-24"]},
                                    {name: 'Last Week', p80: stats.ttfb["p80-168"], p95: stats.ttfb["p95-168"], p99: stats.ttfb["p99-168"]},
                                ]} series={{"p80": colorChanger(theme.colors.primary, 50), "p95": theme.colors.primary, "p99": colorChanger(theme.colors.primary, -50)}}
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <StatBarChart title="Spent money" units="Siacoin" icon={faMoneyBillAlt}
                                data={[
                                    {name: 'Hour', "Spent": stats.money_spent["1"]},
                                    {name: 'Day', "Spent": stats.money_spent["24"]},
                                    {name: 'Week', "Spent": stats.money_spent["168"]},
                                    {name: 'Month', "Spent": stats.money_spent["720"]},
                                    {name: 'Quarter', "Spent": stats.money_spent["2160"]},
                                ]} series={{"Spent": theme.colors.primary,}}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={6}>
                            <StatBarChart title="Download throughput" units="Mbps" icon={faDownload}
                                data={[
                                    {name: 'Last Hour', p80: stats.download_throughput["p80-1"], p95: stats.download_throughput["p95-1"], p99: stats.download_throughput["p99-1"]},
                                    {name: 'Last Day', p80: stats.download_throughput["p80-24"], p95: stats.download_throughput["p95-24"], p99: stats.download_throughput["p99-24"]},
                                    {name: 'Last Week', p80: stats.download_throughput["p80-168"], p95: stats.download_throughput["p95-168"], p99: stats.download_throughput["p99-168"]},
                                ]} series={{"p80": colorChanger(theme.colors.primary, 50), "p95": theme.colors.primary, "p99": colorChanger(theme.colors.primary, -50)}}
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <StatBarChart title="Upload throughput" units="Mbps" icon={faUpload}
                                data={[
                                    {name: 'Last Hour', p80: stats.upload_throughput["p80-1"], p95: stats.upload_throughput["p95-1"], p99: stats.upload_throughput["p99-1"]},
                                    {name: 'Last Day', p80: stats.upload_throughput["p80-24"], p95: stats.upload_throughput["p95-24"], p99: stats.upload_throughput["p99-24"]},
                                    {name: 'Last Week', p80: stats.upload_throughput["p80-168"], p95: stats.upload_throughput["p95-168"], p99: stats.upload_throughput["p99-168"]},
                                ]} series={{"p80": colorChanger(theme.colors.primary, 50), "p95": theme.colors.primary, "p99": colorChanger(theme.colors.primary, -50)}}
                            />
                        </Col>
                    </Row>
                </Container>
            </Row>
        </Container>
    </div> )
}


// Custom component: StatBox
function StatBox(props) {
    return <Col md={5} lg={3} style={{border: '2px solid ' + theme.colors.statsElementsBorder, borderRadius: "15px", paddingTop: "20px", paddingBottom: "20px", justifyContent: 'center', textAlign: 'center', marginBottom: 50}}>
        <div style={{ position: "absolute", top: -12, width: "100%" }}>
            <span style={{ backgroundColor: theme.colors.background, fontSize: "15px", padding: 15, marginRight: 30, color: theme.colors.statsElementsBorder }}>
                {props.title}
            </span>
        </div>
        <FontAwesomeIcon icon={props.icon} size={"2x"} transform={props.iconTransform} style={{ color: theme.colors.primary }}/> 
        <span style={{ fontSize: "32px", fontWeight: "bold", paddingLeft: "15px", color: theme.colors.text }}>{props.stat}
            <span style={{fontSize: "50%", paddingLeft: 5}}>
                {props.suffix}
            </span>
        </span>
    </Col>
}

// Custom component: StatBarChart
function StatBarChart(props) {
    // "series" is an object containing the name of the data serie and the color for the chart. It is
    // mapped to a <Bar> component. Its format as an input prop is, as an example:
    // {"p80": "#8884d8", "p95": "#82ca9d", "p99": "#666"}
    const series = props.series
        
    return (
        <div style={{ paddingTop: 40, color: theme.colors.text }}>
            <FontAwesomeIcon icon={props.icon} />
            <span style={{ fontSize: "16px", fontWeight: "bold", paddingLeft: "10px" }}>{props.title}</span>
            <div style={{ height: 350 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={props.data}
                        margin={{
                        top: 25, right: 25, left: 25, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" stroke={ theme.colors.text }/>
                        <YAxis stroke={ theme.colors.text } label={
                            <Text fill={theme.colors.text} dx={30} dy={180} offset={0} angle={-90}>{props.units}</Text> 
                        }/>
                        <Tooltip  />
                        <Legend />
                        {Object.keys(series).map(function(key, index) {
                            return <Bar dataKey={key} fill={series[key]} />
                        })}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

function colorChanger(hex, rgbAddition) {
    // For the charts we create variations of the primary color
    // This function transforms the HEX value into rgb, adds or substracts "rgbAddition"
    // to eeach color component and transforms again into a new HEX value. By default, I 
    // recommend a value of "rgbAddotion" = 50
    try {
        var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        var r = parseInt(rgb[1], 16) + rgbAddition
        if (r > 255) {r = 255}
        if (r < 0) {r = 0}
        var g = parseInt(rgb[2], 16) + rgbAddition
        if (g > 255) {g = 255}
        if (g < 0) {g = 0}
        var b = parseInt(rgb[3], 16) + rgbAddition
        if (b > 255) {b = 255}
        if (b < 0) {b = 0}
        var newHex = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        return newHex
    } catch (e) {
        return "#000000"
    }
}

function componentToHex(c) {
    // From an rgb component value to HEX (double digit)
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}