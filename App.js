import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import Ball from "./src/ball";
import SafeAreaView from "./src/components/safe-area-view/SafeAreaView";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Ball />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
