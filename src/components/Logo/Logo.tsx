import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';

const {height, width} = Dimensions.get('screen');

const Logo = () => {
  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        width: width * 0.34,
        height: width * 0.34,
        borderRadius: 500,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{width: 80, height: 50}}>
        <Image
          source={require('../../assets/Logo.png')}
          style={{height: '100%', width: '100%'}}
        />
      </View>
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({});
