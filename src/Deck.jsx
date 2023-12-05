import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Animated,
  StyleSheet,
  PanResponder,
  FlatList,
  Dimensions,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function Deck({ renderCard, data }) {
  const [panResponder, setPanResponder] = useState(null);
  const [position, setPosition] = useState(new Animated.ValueXY());

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ["-120deg", "0deg", "120deg"],
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  const backToDefaultPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    setPanResponder(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gesture) => {
          position.setValue({ x: gesture.dx, y: gesture.dy });
        },
        onPanResponderRelease: () => {
          backToDefaultPosition();
        },
      })
    );
  }, []);

  useEffect(() => {
    setPosition(position);
  }, [position]);

  if (!panResponder) return null;

  return (
    <FlatList
      data={data}
      renderItem={(flatItem) => {
        const { item, index } = flatItem;

        if (index === 0) {
          return (
            <Animated.View
              style={getCardStyle()}
              {...panResponder?.panHandlers}
            >
              {renderCard?.(item)}
            </Animated.View>
          );
        }

        return renderCard?.(item);
      }}
      keyExtractor={(item, index) => `card-id-${item?.id}`}
    />
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
