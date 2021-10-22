import React, { Component } from "react";
import {Text, View} from 'react-native';

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

      // data has been populated, build content. First set in the weatherlist contain most recent measurement.
      //the rest is used for generating graphs.
      // placeholder, print latest observation as text.
  render() {
    if (!this.state.loading) {

      const weatherArray = Object.keys(this.state.weatherList)
        .filter((key) => this.filterKeys(key))
        .map((key) => [key, this.state.weatherList[key]]);

      return (
        <View style={{flex: 1, justifyContent:"flex-start", alignSelf:"center", alignItems:"center"}}>
          
          <View style={{flexDirection:'row', height: 5}}></View>
          <View style={{flexDirection:'row'}}>
              <Text style={{fontWeight:"bold", fontSize:40}}>
                {this.props.strings.ui.currentHeadline}
              </Text>
          </View>

          <View style={{flexDirection:'row'}}>
              <Text style={{fontSize:20}}>
                {this.props.strings.ui.currentDescription}
              </Text>
          </View>

        <View style={{height: 20, flexDirection:'row'}}></View>

          {weatherArray.map((key) => (
            <View key={key[0]} style={{flexDirection:'row'}}>
                <Text style={{fontWeight: "bold"}}>
                  {this.props.strings.weather[key[0]]}
                </Text>
                  <Text>{": "}</Text>
                <Text> 
                  {key[1]}
                </Text> 
            </View>
          ))}

        </View>
      );
    }
    else return  <View style={{flexDirection:'row', height: 200}} ><Loading /></View>;
  }

  filterKeys = (key) => {
    //don't map keys beginning with 'indoor'
    if (!key.startsWith("indoor") && key !== "id") {
      return key;
    }  else {
      return null
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
