import React from "react";
import { View, Animated, StyleSheet } from "react-native";

export default function Deck({ renderCard, data }) {
  const renderCards = () => {
    return data?.map((item) => renderCard(item));
  };

  return <View style={styles.mainContainer}>{renderCards()}</View>;
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
