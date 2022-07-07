/* eslint-disable camelcase */
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { View } from '../Themed';

interface IStatusBarProps {
  statusBar: string;
}

export const StatusBar: React.FC<IStatusBarProps> = ({ statusBar }) => {
  return (
    <View style={styles.timer}>
      <Text style={styles.timerNum}>{statusBar}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  timer: {
    paddingHorizontal: 35,
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  timerNum: {
    fontFamily: 'Orbitron_400Regular',
    fontSize: 30,
    color: '#18A3DF',
    backgroundColor: 'transparent',
  },
});
