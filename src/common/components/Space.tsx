import React from 'react';
import {View} from 'react-native';

interface SpaceVerticalProps {
  px: number;
}
const SpaceVertical = ({px}: SpaceVerticalProps) => (
  <View
    style={{
      marginTop: px,
    }}
  />
);

const SpaceHorizontal = ({px}: SpaceVerticalProps) => (
  <View
    style={{
      marginRight: px,
    }}
  />
);

export const Space = {
  V: SpaceVertical,
  H: SpaceHorizontal,
};

