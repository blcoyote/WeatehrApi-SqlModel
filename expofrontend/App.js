import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import settings from "./Settings/config";
import { StyleSheet, Text, View } from "react-native";
import "bootstrap/dist/css/bootstrap.css";
import WeatherContainer from "./Components/WeatherContainer";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";
import GraphContainer from "./Components/GraphContainer";

import strings from "./Localization/Locales";

export default class App extends Component {
  state = {
    weatherList: [],
    error: false,
    loading: false,
    locale: "dk",
  };
  componentDidMount() {}

  render() {
    strings.setLanguage(this.state.locale);
    document.title = strings.ui.pageTitle;

    return (
      <Container>
        <br />
        <br />
        <View style={styles.container}>
          <Tabs
            variant="tabs"
            defaultActiveKey="home"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="home" title={strings.ui.home}>
              <WeatherContainer strings={strings}></WeatherContainer>
            </Tab>

            <Tab eventKey="history" title={strings.ui.history}>
              <GraphContainer strings={strings} />
            </Tab>
            <Tab eventKey="info" title={strings.ui.info}>
              Text der skal være når man laver apps!!!
            </Tab>
          </Tabs>
          <StatusBar style="auto" />
        </View>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "top",
  },
});
