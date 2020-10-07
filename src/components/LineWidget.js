import React from 'react'
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import Chart from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
ReactFC.fcRoot(FusionCharts, Chart, FusionTheme);
function LineWidget(props) {
    const chartConfigs = {
        type: "line", 
        width: "100%", 
        height: "200", 
        dataFormat: "json", 
        dataSource: {

          chart: {
            bgColor:"#171717",
            
            theme: "fusion"
          },
                    data: props.data
        }
      };
    return (
        <div className="widget-container">
            <div className="widget-title">{props.title}</div>
            <ReactFC {...chartConfigs}/>
        </div>
    )
}

export default LineWidget;
