import React, { useEffect, useState } from "react";
import {
  View,
  Animated,
  StyleSheet,
  PanResponder,
  FlatList,
} from "react-native";

export default function Deck({ renderCard, data }) {
  const [panResponder, setPanResponder] = useState(null);
  const [axisX, setAxisX] = useState(null);
  const [axisY, setAxisY] = useState(null);

  const position = new Animated.ValueXY();

  const updatePosition = (gesture) => {
    setAxisX(gesture?.dx);
    setAxisY(gesture?.dy);
  };

  useEffect(() => {
    setPanResponder(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gesture) => {
          updatePosition?.(gesture);
        },
        onPanResponderRelease: () => {},
      })
    );
  }, []);

  useEffect(() => {
    position.setValue({ x: axisX, y: axisY });
  }, [axisX, axisY]);

  if (!panResponder) return null;

  return (
    <Animated.View style={position.getLayout()} {...panResponder?.panHandlers}>
      <FlatList
        data={data}
        renderItem={(flatItem) => {
          const { item, index } = flatItem;

          return renderCard?.(item);
        }}
        keyExtractor={(item, index) => `card-id-${item?.id}`}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
