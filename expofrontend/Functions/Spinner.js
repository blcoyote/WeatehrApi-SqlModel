
import { ActivityIndicator, View } from "react-native";
import React from "react";

export default class Loading extends React.PureComponent {
    render () {
    return (
      <View style={{flex: 1, justifyContent:"flex-start", alignSelf:"center", alignItems:"center"}}>
        <ActivityIndicator size="large" />
      </View>
    );
    }
  }
  