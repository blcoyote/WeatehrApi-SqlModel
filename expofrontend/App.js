import { StatusBar } from "expo-status-bar";
import React from "react";
import settings from "./Settings/config";
import { StyleSheet, Text, View } from "react-native";
import "bootstrap/dist/css/bootstrap.css";
import WeatherContainer from "./Components/WeatherContainer";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";

export default function App() {
  document.title = "Vejret i Galten";

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
          <Tab eventKey="home" title="Vejret Lige Nu">
            <WeatherContainer host={settings.apiHost}></WeatherContainer>
          </Tab>

          <Tab eventKey="history" title="Historik">
            Grafter!!!
          </Tab>
          <Tab eventKey="info" title="Info">
            Text der skal være når man laver apps!!!
          </Tab>
        </Tabs>
        <StatusBar style="auto" />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "top",
  },
});
