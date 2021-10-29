import React, { Component } from "react";
import { Dimensions } from "react-native";

//https://www.npmjs.com/package/react-native-chart-kit
import { LineChart } from "react-native-chart-kit";

//https://www.npmjs.com/package/recharts/v/2.0.0-beta.1

export class WeatherGraph extends Component {
  render() {
    //generate datasets
    let datasets = [];

    if (this.props.primaryData) {
      datasets.push({
        data: this.props.primaryData,
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(0, 65, 244, ${opacity})`, // optional
      });
    }
    if (this.props.secondaryData) {
      datasets.push({
        data: this.props.secondaryData,
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(128, 0, 0, ${opacity})`, // optional
      });
    }

    return (
      <LineChart
        data={{
          labels: this.props.labels,
          datasets: datasets,
          legend: this.props.legend,
        }}
        width={widthCalculator()}
        height={220}
        yAxisLabel={this.props.yLabel}
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: "#1cc910",
          backgroundGradientFrom: "#eff3ff",
          backgroundGradientTo: "#efefef",
          decimalPlaces:
            Number(this.props.primaryData[0]).toFixed(1).length > 3 ? 0 : 1,
          color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    );
  }
}

const widthCalculator = () => {
  if (Dimensions.get("window").width - 16 < 700) {
    return Dimensions.get("window").width - 16;
  } else {
    return 700;
  }
};

export default WeatherGraph;
