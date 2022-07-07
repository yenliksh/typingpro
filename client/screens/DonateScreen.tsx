import * as Linking from 'expo-linking';
import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';
import i18n from 'i18n-js';
import { Text } from '../components/Themed';
import { BITPAY_ACCOUNT, PAYPAL_ICON, PAYPAL_LINK } from '../constants/common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#FFF',
  },
  optionBlock: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  paypalLogo: {
    width: 100,
    height: 26,
  },
  linkStyle: {
    color: 'blue',
    fontSize: 18,
    fontWeight: '500',
  },
  bitpayText: {
    fontSize: 25,
    color: '#0038a8',
    fontWeight: '800',
  },
  textStyle: {
    color: 'black',
    fontSize: 18,
    fontWeight: '500',
  },
});

export const DonateScreen: React.FC = observer(() => {
  const handlePress = useCallback(() => {
    Linking.openURL(`http://${PAYPAL_LINK}`);
  }, []);

  const handleCopy = useCallback(async () => {
    await Clipboard.setString(BITPAY_ACCOUNT);
    Toast.show(i18n.t('copiedClipboard'), {
      duration: Toast.durations.SHORT,
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.optionBlock} onTouchEnd={handlePress}>
        <Image
          style={styles.paypalLogo}
          source={{
            uri: PAYPAL_ICON,
          }}
        />
        <Text style={styles.linkStyle}>{PAYPAL_LINK}</Text>
      </View>
      <View style={styles.optionBlock} onTouchEnd={handleCopy}>
        <Text style={styles.bitpayText}>
          bitpay{' '}
          <MaterialCommunityIcons name="content-copy" size={24} color="black" />
        </Text>
        <Text style={styles.textStyle}>{BITPAY_ACCOUNT}</Text>
      </View>
    </View>
  );
});

export default DonateScreen;
