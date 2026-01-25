import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { Theme } from '@/theme';

interface RemindrLogoProps {
  size?: number;
  style?: any;
}

export const RemindrLogo = ({ size = 160, style }: RemindrLogoProps) => {
  return (
    <View style={[
      styles.container, 
      { 
        width: size, 
        height: size, 
        borderRadius: 48 
      },
      style
    ]}>
      <Svg width={128} height={128} viewBox="0 0 1024 1024" fill="none">
        <G transform="translate(-60, -70) scale(1.12)">
          <Path
            d="M 430 700
               L 430 420
               C 430 330 480 280 560 280
               L 650 280
               C 700 280 720 320 700 350
               C 680 380 640 400 600 400
               L 520 400
               L 520 700
               C 520 740 500 760 470 760
               C 445 760 430 740 430 700
               Z"
            fill="#FFFFFF"
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0B0B0F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)', // border-white/5
    boxShadow: '0px 30px 48px rgba(0, 0, 0, 0.9)',
    elevation: 48, // for Android
  },
});
