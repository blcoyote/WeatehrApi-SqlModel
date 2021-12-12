import React, { Component } from "react";
import { Text, View } from "react-native";

import settings from "../Settings/config";
import Loading from "../Functions/Spinner";

export default class WeatherContainer extends Component {
  state = {
    weatherList: {},
    error: false,
    loading: true,
    ws: null,
  };

  timeout = 250;

  componentDidMount() {
    this.connect();
  }

  //clear timer when component is unmounted.

  connect = () => {
    var ws = new WebSocket(settings.websocketHost + "/ws");
    let that = this; // cache the this
    var connectInterval;

    // websocket onopen event listener
    ws.onopen = () => {
      console.log("Connected websocket main component");

      this.setState({ ws: ws });

      that.timeout = 250; // reset timer to 250 on open of websocket connection
      clearTimeout(connectInterval); // clear Interval on on open of websocket connection
    };

    // websocket onclose event listener
    ws.onclose = (e) => {
      console.log(
        `Socket is closed. Reconnect will be attempted in ${Math.min(
          10000 / 1000,
          (that.timeout + that.timeout) / 1000
        )} second.`,
        e.reason
      );

      that.timeout = that.timeout + that.timeout; //increment retry interval
      connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
    };

    // websocket onerror event listener
    ws.onerror = (err) => {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );

      ws.close();
    };

    ws.onmessage = (evt) => {
      // listen to data sent from the websocket server
      //console.log(evt);
      const message = JSON.parse(evt.data);
      this.setState({ weatherList: message });
      //console.log(message)
    };
  };

  /**
   * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
   */
  check = () => {
    const { ws } = this.state;
    if (!ws || ws.readyState == WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
  };

  // data has been populated, build content. First set in the weatherlist contain most recent measurement.
  // the rest is used for generating graphs.
  // placeholder, print latest observation as text.
  render() {
    if (this.state.weatherList) {
      const weatherArray = Object.keys(this.state.weatherList)
        .filter((key) => this.filterKeys(key))
        .map((key) => [key, this.state.weatherList[key]]);

      return (
        <View fluid
          style={{
            width:"100%",
            flex: 1,
            backgroundColor: "white",
            justifyContent: "flex-start",
            alignSelf: "center",
            alignItems: "center",
          }}
        >
        </View>
      );
    } else
      return (
        <View style={{ flexDirection: "row", height: 200 }}>
          <Loading />
        </View>
      );
  }

  filterKeys = (key) => {
    //don't map keys beginning with 'indoor'
    if (!key.startsWith("indoor") && key !== "id") {
      return key;
    } else {
      return null;
    }
  };
}
