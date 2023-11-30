import React from "react";
import {
  Platform,
  SafeAreaView as ReactNativeSafeAreaView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

export default function SafeAreaView({ style, children }) {
  return (
    <>
      <ReactNativeSafeAreaView style={[styles.avoidTopBarAndroid, style]}>
        {children}
      </ReactNativeSafeAreaView>
      <ExpoStatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  avoidTopBarAndroid: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
