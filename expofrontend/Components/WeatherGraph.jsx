import React, { Component } from "react";
import { StyleSheet, Dimensions } from "react-native";

//https://www.npmjs.com/package/react-native-chart-kit
import { LineChart } from "react-native-chart-kit";



//https://www.npmjs.com/package/recharts/v/2.0.0-beta.1


export class WeatherGraph extends Component {
  render() {

    return (
      <>
        <LineChart
          data={{
            labels: this.props.labels,
            datasets: [
              {
                data: this.props.primaryData,
                strokeWidth: 2,
                color: (opacity = 1) => `rgba(0, 65, 244, ${opacity})`, // optional
              },
              {
                data: this.props.secondaryData,
                strokeWidth: 2,
                color: (opacity = 1) => `rgba(128, 0, 0, ${opacity})`, // optional
              },
            ],
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
            decimalPlaces: Number(this.props.primaryData[0]).toFixed(1).length > 3 ? 0 : 1,
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
      </>
    );
  }
}

export default WeatherGraph;



const widthCalculator = () => {
  if (Dimensions.get("window").width - 16 < 700) {
    return Dimensions.get("window").width - 16;
  } else {
    return 700;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "center",
    padding: 10,
  },
  header: {
    textAlign: "center",
    fontSize: 18,
    padding: 16,
    marginTop: 16,
  },
});
