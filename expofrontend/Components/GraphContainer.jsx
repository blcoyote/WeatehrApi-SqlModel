import React, { Component } from "react";
import settings from "../Settings/config";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { apiHandler } from "../Functions/WeatherRequests";
class ChartContainer extends Component {
  state = {
    weatherList: [],
    error: false,
    loading: true,
  };

  componentDidMount() {
    this.fetchWeather();
  }

  render() {
    // fetch data, generate datasets fro graphs
    // instantiate cards with graphs
    if (this.state.loading) {
      //loading indicator spinner
      return <div>{loading()}</div>;
    } else {
      //app
      return <div></div>;
    }
  }
  //query api for status
  fetchWeather = () => {
    var configuration = {
      method: "get",
      // day_delta is number of days to pull. result interval returns every Nth record. 12 = 1 record pr hour as records are 5 minute intervals
      // daydelta 1 and interval 12 returns 24 hours of records, with one record pr hour
      url:
        settings.apiHost +
        "/weatherstation/getweather?day_delta=1&result_interval=12",
      headers: {
        //token: this.props.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    //console.log(configuration);
    apiHandler(configuration, this.fetchSuccess, this.fetchError);
  };

  fetchSuccess = (props) => {
    //console.log(props.data);
    this.setState({ weatherList: props.data, Error: false });
  };
  fetchError = (props) => {
    //console.log(props);
    this.setState({ error: true });
  };
}

export default ChartContainer;

const generateLables = (timestamp) => {
  // generate list of lables (24 hours) depending on latest timestamp
};

const generateDatasets = (key, dataset) => {
  //generate a structure that can extrapolate single values ranges from the weatherobservation dataset.
  //perhaps returning arrays of all datapoints of a specific key. That can be used for graph generation
};

function loading() {
  return (
    <View style={[styles.container, styles.horizontal]}>
      <br />
      <br />
      <br />
      <br />

      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
