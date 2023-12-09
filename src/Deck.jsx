import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  PanResponder,
  Dimensions,
  StatusBar,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;

export default function Deck({
  renderCard,
  data,
  onSwipeLeft,
  onSwipeRight,
  renderNoMoreCard,
}) {
  const [panResponder, setPanResponder] = useState(null);
  const [position, setPosition] = useState(new Animated.ValueXY());
  const [currentIndex, setCurrentIndex] = useState(0);

  const componentWillUpdate = useRef(true);

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
      ? onSwipeLeft?.(data?.[currentIndex])
      : onSwipeRight?.(data?.[currentIndex]);
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
            swipeToExit("right");
          } else if (gesture.dx < -SWIPE_THRESHOLD) {
            swipeToExit("left");
          } else {
            backToDefaultPosition();
          }
        },
      })
    );

    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  useEffect(() => {
    setPosition(position);
  }, [position]);

  useLayoutEffect(() => {
    LayoutAnimation.spring();
  }, [currentIndex]);

  if (!panResponder) return null;

  return data
    ?.map((item, index) => {
      if (currentIndex >= data?.length && index === data?.length - 1) {
        return renderNoMoreCard?.();
      }

      if (index < currentIndex) return null;

      if (index === currentIndex) {
        return (
          <Animated.View
            key={`animated-card-warpper-id-${item?.id}`}
            style={[getCardStyle(), styles.mainContainer]}
            {...panResponder?.panHandlers}
          >
            {renderCard?.(item)}
          </Animated.View>
        );
      }

      return (
        <Animated.View
          key={`card-warpper-id-${item?.id}`}
          style={[styles.mainContainer, { top: 10 * (index - currentIndex) }]}
        >
          {renderCard?.(item)}
        </Animated.View>
      );
    })
    .reverse();
}

const styles = StyleSheet.create({
  mainContainer: {
    position: "absolute",
    width: SCREEN_WIDTH,
    paddingTop: StatusBar.currentHeight,
  },
});
