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

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-500, 0, 500],
      outputRange: ["-120deg", "0deg", "120deg"],
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
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
