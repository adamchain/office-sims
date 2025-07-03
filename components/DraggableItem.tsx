import React from 'react';
import { Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface DraggableItemProps {
  children: React.ReactNode;
  x: number;
  y: number;
  zIndex: number;
  onPositionChange: (x: number, y: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  bounds?: {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
  };
  disabled?: boolean;
}

export default function DraggableItem({
  children,
  x,
  y,
  zIndex,
  onPositionChange,
  onDragStart,
  onDragEnd,
  bounds = {},
  disabled = false,
}: DraggableItemProps) {
  const translateX = useSharedValue(x);
  const translateY = useSharedValue(y);
  const scale = useSharedValue(1);
  const isDragging = useSharedValue(false);
  const shadowOpacity = useSharedValue(0.2);

  // Update position when props change
  React.useEffect(() => {
    translateX.value = withSpring(x, {
      damping: 20,
      stiffness: 300,
    });
    translateY.value = withSpring(y, {
      damping: 20,
      stiffness: 300,
    });
  }, [x, y]);

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onStart(() => {
      isDragging.value = true;
      scale.value = withSpring(1.05, { damping: 15, stiffness: 400 });
      shadowOpacity.value = withTiming(0.4, { duration: 150 });
      
      if (onDragStart) {
        runOnJS(onDragStart)();
      }
    })
    .onUpdate((event) => {
      const newX = x + event.translationX;
      const newY = y + event.translationY;

      // Apply bounds constraints
      const constrainedX = Math.max(
        bounds.minX ?? 0,
        Math.min(bounds.maxX ?? screenWidth - 100, newX)
      );
      const constrainedY = Math.max(
        bounds.minY ?? 50,
        Math.min(bounds.maxY ?? screenHeight - 150, newY)
      );

      translateX.value = constrainedX;
      translateY.value = constrainedY;
    })
    .onEnd(() => {
      isDragging.value = false;
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      shadowOpacity.value = withTiming(0.2, { duration: 150 });

      // Snap to final position
      const finalX = translateX.value;
      const finalY = translateY.value;

      translateX.value = withSpring(finalX, {
        damping: 20,
        stiffness: 300,
      });
      translateY.value = withSpring(finalY, {
        damping: 20,
        stiffness: 300,
      });

      if (onPositionChange) {
        runOnJS(onPositionChange)(finalX, finalY);
      }

      if (onDragEnd) {
        runOnJS(onDragEnd)();
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const elevation = interpolate(
      isDragging.value ? 1 : 0,
      [0, 1],
      [zIndex, zIndex + 1000]
    );

    return {
      position: 'absolute',
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      zIndex: elevation,
      shadowOpacity: shadowOpacity.value,
      shadowOffset: {
        width: isDragging.value ? 4 : 2,
        height: isDragging.value ? 8 : 4,
      },
      shadowRadius: isDragging.value ? 12 : 6,
      elevation: elevation,
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}