export const BottomTransition = (index, position, height) => {
  const sceneRange = [index - 1, index, index + 1];
  const outputHeight = [height, 0, 0];
  const transition = position.interpolate({
    inputRange: sceneRange,
    outputRange: outputHeight,
  });

  return {
    transform: [
      {
        translateY: transition,
      },
    ],
  };
};
