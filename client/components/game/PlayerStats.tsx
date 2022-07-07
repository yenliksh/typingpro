import i18n from 'i18n-js';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { View } from '../Themed';

interface IPlayerStatsProps {
  hasStarted?: boolean;
  playersCount?: number;
  winningPlace?: number;
  cpm?: number;
  textStyle?: { fontFamily: string };
}

export const PlayerStats: React.FC<IPlayerStatsProps> = ({
  hasStarted,
  playersCount,
  winningPlace,
  cpm,
  textStyle,
}) => {
  const positionText = !hasStarted
    ? ''
    : `${winningPlace} ${i18n.t('of')} ${playersCount}`;
  const cpmText = !hasStarted ? '' : cpm;

  return (
    <View style={styles.container}>
      <Text style={[styles.text, textStyle]}>
        {i18n.t('yourPosition')} {positionText}
      </Text>
      <Text style={[styles.text, textStyle]}>
        {i18n.t('yourCpm')} {cpmText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#18A3DF',
  },
});
