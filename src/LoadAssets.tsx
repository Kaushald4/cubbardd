import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';
import * as Font from 'expo-font';

const LoadAssets = (props: any) => {
  const theme = useTheme();
  const [isFontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    LoadFontAsync();
  }, []);

  const LoadFontAsync = async () => {
    try {
      setFontLoaded(false);
      await Font.loadAsync({
        'Ubuntu-Bold': require('./assets/fonts/Ubuntu-Bold.ttf'),
        'Ubuntu-Light': require('./assets/fonts/Ubuntu-Light.ttf'),
        'Ubuntu-Medium': require('./assets/fonts/Ubuntu-Medium.ttf'),
        'Ubuntu-Regular': require('./assets/fonts/Ubuntu-Regular.ttf'),
      });
      setFontLoaded(true);
    } catch (error) {
      console.log('error in loading fonts.... ', error);
    }
  };

  if (!isFontLoaded) {
    return <View style={{backgroundColor: theme.colors.primary, flex: 1}} />;
  } else {
    return <>{props.children}</>;
  }
};

export default LoadAssets;
