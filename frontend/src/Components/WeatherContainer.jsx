import React, { Component } from "react";
import { apiHandler } from "../Functions/WeatherRequests";
import Container from "react-bootstrap/Container";


// this class should contain logic to render statuscards based on reply from api /status
// and render the lastest modified jobs wrapped in status cards.
export default class WeatherContainer extends Component {
  state = {
    weatherList: [],
    error: false,
  };

  // trigger every 60.000 milisecond (1 minute)
  componentDidMount() {
    this.fetchWeather();
    this.interval = setInterval(() => {
      this.fetchWeather();
    }, 60000);
  }

  //clear timer when component is unmounted.
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    if (this.state.weatherList) {
      // data has been populated, build content. first set in the weatherlist contain latest measurements.
      //the rest is used for generating graphs.
      return (
        <Container>
          
        </Container>
      );
    } else return <div></div>;
  }


//query api for status
fetchWeather = () => {
    var configuration = {
      method: "get",
      // day_delta is number of days to pull. result interval returns every Nth record. 12 = 1 record pr hour as records are 5 minute intervals
      // daydelta 1 and interval 12 returns 24 hours of records, with one record pr hour
      url: this.props.host + "/weatherstation/getweather?day_delta=1&result_interval=12",
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