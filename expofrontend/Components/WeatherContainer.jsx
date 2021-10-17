import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import settings from "../Settings/config";
import Loading from "../Functions/Spinner"
import { apiHandler } from "../Functions/WeatherRequests";


export default class WeatherContainer extends Component {
  state = {
    weatherList: {},
    error: false,
    loading: true,
  };

  // trigger every 300.000 miliseconds (5 minutes)
  componentDidMount() {
    this.fetchWeather();
    this.interval = setInterval(() => {
      this.fetchWeather();
    }, 300000);
  }

  //clear timer when component is unmounted.
  componentWillUnmount() {
    clearInterval(this.interval);
  }


  // add modular ui elements via https://react-bootstrap.github.io/components/cards/
  render() {
    if (!this.state.loading) {
      // data has been populated, build content. First set in the weatherlist contain most recent measurement.
      //the rest is used for generating graphs.
      // placeholder, print latest observation as text.
      const weatherArray = Object.keys(this.state.weatherList)
        .filter((key) => this.filterKeys(key))
        .map((key) => [key, this.state.weatherList[key]]);

      // TODO:
      // function to convert contents such as winddirection from degrees to compass system

      return (
        <Container>
          <Row className="justify-content-md-center">
            <Col xs lg="">
              {" "}
            </Col>
            <Col md="auto">
              <h2>{this.props.strings.ui.currentHeadline}</h2>
            </Col>
            <Col xs lg="">
              {" "}
            </Col>
          </Row>

          <Row className="justify-content-md-center">
            <Col xs lg="">
              {" "}
            </Col>
            <Col md="auto">
              <h5>{this.props.strings.ui.currentDescription}</h5>
            </Col>
            <Col xs lg="">
              {" "}
            </Col>
          </Row>

          {weatherArray.map((key) => (
            <Row key={key[0]} className="justify-content-md-center">
              <Col xs lg="">
                {" "}
              </Col>
              <Col md="auto">
                <b>{this.props.strings.weather[key[0]]}:</b> {key[1]}{" "}
              </Col>
              <Col xs lg="">
                {" "}
              </Col>
            </Row>
          ))}
        </Container>
      );
    }
    // loadspinner -v
    else return <> {<Loading/>}</>;
  }

  filterKeys = (key) => {
    //don't map keys beginning with 'indoor'
    if (!key.startsWith("indoor") && key !== "id") {
      return key;
    }
  };

  //query api for status
  fetchWeather = () => {
    var configuration = {
      method: "get",
      // day_delta is number of days to pull. result interval returns every Nth record. 12 = 1 record pr hour as records are 5 minute intervals
      // daydelta 1 and interval 12 returns 24 hours of records, with one record pr hour
      url:
        settings.apiHost +
        "/weatherstation/getlatest?imperial=false",
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
    this.setState({ weatherList: props.data, error: false, loading: false });
  };
  fetchError = (props) => {
    //console.log(props);
    this.setState({ error: true });
  };
}
