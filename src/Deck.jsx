import React, { useEffect, useState } from "react";
import { View, Animated, StyleSheet, PanResponder } from "react-native";

export default function Deck({ renderCard, data }) {
  const [panResponder, setPanResponder] = useState(null);

  const renderCards = () => {
    return data?.map((item) => renderCard(item));
  };

  useEffect(() => {
    setPanResponder(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gesture) => {
          console.log("gesture: ", gesture);
        },
        onPanResponderRelease: () => {},
      })
    );
  }, []);

  return <View style={styles.mainContainer}>{renderCards()}</View>;
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
