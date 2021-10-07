import { StatusBar } from "expo-status-bar";
import React from "react";
import settings from "./Settings/config";
import { StyleSheet, Text, View } from "react-native";
import "bootstrap/dist/css/bootstrap.css";
import WeatherContainer from "./Components/WeatherContainer";

export default function App() {
  document.title = "Vejret i Galten";

  return (
    <View style={styles.container}>
      <WeatherContainer host={settings.apiHost}></WeatherContainer>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
