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
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;

export default function Deck({ renderCard, data, onSwipeLeft, onSwipeRight }) {
  const [panResponder, setPanResponder] = useState(null);
  const [position, setPosition] = useState(new Animated.ValueXY());
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const onCardLeftScreen = (side) => {
    side === "left"
      ? onSwipeLeft?.(data?.[index])
      : onSwipeRight?.(data?.[index]);
    setCurrentIndex((value) => value + 1);
    position.setValue({ x: 0, y: 0 });
  };

  const swipeToExit = (side) => {
    const x = side === "left" ? -SCREEN_WIDTH : SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onCardLeftScreen(side));
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
        onPanResponderRelease: (event, gesture) => {
          if (gesture.dx > SWIPE_THRESHOLD) {
            console.log("swipe like!");
            swipeToExit("right");
          } else if (gesture.dx < -SWIPE_THRESHOLD) {
            console.log("swipe dislike!");
            swipeToExit("left");
          } else {
            backToDefaultPosition();
          }
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
      extraData={[currentIndex]}
      renderItem={(flatItem) => {
        const { item, index } = flatItem;

        if (index < currentIndex) return null;

        if (index === currentIndex) {
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
