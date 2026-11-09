import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { theme } from '../constants/theme';

/**
 * Press feedback for buttons: the <Pressable> stays the PARENT, the
 * <Animated.View style={{transform:[{scale}]}}> lives INSIDE it.
 * Only transform is animated, so useNativeDriver stays true.
 */
export function usePressScale(to: number = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: to,
      tension: theme.animation.snappy.tension,
      friction: theme.animation.snappy.friction,
      useNativeDriver: true,
    }).start();
  }, [scale, to]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.animation.snappy.tension,
      friction: theme.animation.snappy.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}

export default usePressScale;
