import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import flag from "./assets/flag.jpg";
import strings from "./Localization/Locales";
const WeatherContainer = React.lazy(() =>
  import("./Components/WeatherContainer")
);
const GraphContainer = React.lazy(() => import("./Components/GraphContainer"));

const HomeRoute = () => (
  <React.Suspense fallback={<Text>{""}</Text>}>
    <WeatherContainer
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "flex-start",
        alignSelf: "center",
        alignItems: "center",
      }}
      strings={strings}
    />
  </React.Suspense>
);

const HistoryRoute = () => (
  <React.Suspense fallback={<Text>{""}</Text>}>
    <GraphContainer
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "flex-start",
        alignSelf: "center",
        alignItems: "center",
      }}
      strings={strings}
    />
  </React.Suspense>
);

const InfoRoute = () => (
  <React.Suspense fallback={<Text>{""}</Text>}>
    <Text
      style={{
        width:"100%",
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignSelf: "center",
        alignItems: "center",
      }}
    >
      {"Tekst der skal være når man laver apps!!!"}
    </Text>
  </React.Suspense>
);

const initialLayout = { width: Dimensions.get("window").width };

const renderScene = SceneMap({
  first: HomeRoute,
  second: HistoryRoute,
  third: InfoRoute,
});

export default function App() {
  const [index, setIndex] = React.useState(0);
  const [routes, setRoutes] = React.useState([
    { key: "first", title: strings.ui.home },
    { key: "second", title: strings.ui.history },
    { key: "third", title: strings.ui.info },
  ]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#123456" }}>
      <View fluid>
        <StatusBar></StatusBar>
        <View style={{ backgroundColor: "#123456", height: 50 }}>
          <TouchableOpacity
            title={""}
            onPress={() => language()}
            onClick={() => language()}
            style={{
              background: `url(${flag})`,
              width: 25,
              height: 17,
              positon: "absolute",
              top: 30,
              left: 20,
            }}
          >
            <ImageBackground
              source={flag}
              style={{ width: 25, height: 17 }}
            ></ImageBackground>
          </TouchableOpacity>
        </View>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={(props) => (
            <TabBar {...props} style={{ backgroundColor: "#123456" }} />
          )}
        />
      </View>
    </SafeAreaView>
  );

  function language() {
    {
      strings.getLanguage() === "dk"
        ? strings.setLanguage("en")
        : strings.setLanguage("dk");
    }
    setRoutes([
      { key: "first", title: strings.ui.home },
      { key: "second", title: strings.ui.history },
      { key: "third", title: strings.ui.info },
    ]);
  }
}

const styles = StyleSheet.create({
  tabs: {
    marginTop: StatusBar.currentHeight,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
