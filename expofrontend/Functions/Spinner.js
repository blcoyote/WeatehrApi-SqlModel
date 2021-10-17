
import { ActivityIndicator, StyleSheet, View } from "react-native";
import React from "react";

export default class Loading extends React.PureComponent {
    render () {
    return (
      <View style={[loadstyles.container, loadstyles.horizontal]}>
        <br />
        <br />
        <br />
        <br />
        <ActivityIndicator size="large" />
      </View>
    );
    }
  }
  
  //styles
  const loadstyles = StyleSheet.create({
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
