import React from 'react';
import {StyleSheet, Text, Platform, Dimensions} from 'react-native';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

const {height, width, fontScale} = Dimensions.get('screen');

interface Props {
  text: string;
  size: number;
  fw?:
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | 'bold'
    | 'normal';
  numOfLines?: number;
  color: string;
  center?: boolean;
  right?: boolean;
  left?: boolean;
  auto?: boolean;
  pt?: number;
  pb?: number;
  pr?: number;
  pl?: number;
  pv?: number;
  ph?: number;
  ff?: 'Ubuntu-Light' | 'Ubuntu-Bold' | 'Ubuntu-Regular' | 'Ubuntu-Medium';
  shadow?: boolean;
}

const MyText = ({
  text,
  numOfLines,
  size,
  color,
  center,
  right,
  left,
  auto,
  pb,
  pl,
  pr,
  ph,
  pt,
  pv,
  fw,
  ff,
  shadow,
}: Props) => {
  let textAlign: 'center' | 'auto' | 'right' | 'left' | 'justify' = 'auto';
  if (center) {
    textAlign = 'center';
  } else if (right) {
    textAlign = 'right';
  } else if (left) {
    textAlign = 'left';
  } else if (auto) {
    textAlign = 'auto';
  }

  return (
    <Text
      style={{
        fontSize:
          Platform.OS === 'android'
            ? size / fontScale
            : (size * 0.9) / fontScale,
        color: color,
        textAlign,
        paddingVertical: pv,
        paddingHorizontal: ph,
        paddingTop: pt,
        paddingRight: pr,
        paddingLeft: pl,
        paddingBottom: pb,
        fontWeight: fw,
        fontFamily: ff,
        textShadowColor: '#000000',
        textShadowOffset: {height: 10, width: 100},
      }}
      numberOfLines={numOfLines}>
      {text}
    </Text>
  );
};

export default MyText;

const styles = StyleSheet.create({});
