import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthStackNavigator} from './navigators';

export default function Main({theme}: any) {
  return (
    <NavigationContainer theme={theme}>
      <AuthStackNavigator />
    </NavigationContainer>
  );
}
