import { AdMobBanner } from 'expo-ads-admob';
import Constants from 'expo-constants';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import * as Sentry from 'sentry-expo';

const { width: screenWidth } = Dimensions.get('window');

export const BottomAd: React.FC = () => {
  const [showBottomAd, setShowBottomAd] = useState<boolean>(true);

  const handleKeyboardShown = useCallback(() => {
    setShowBottomAd(false);
  }, []);

  const handleKeyboardHidden = useCallback(() => {
    setShowBottomAd(true);
  }, []);

  useEffect(() => {
    const keyboardShownListener = Keyboard.addListener(
      'keyboardDidShow',
      handleKeyboardShown
    );
    const keyboardHiddenListener = Keyboard.addListener(
      'keyboardDidHide',
      handleKeyboardHidden
    );

    return () => {
      keyboardShownListener.remove();
      keyboardHiddenListener.remove();
    };
  }, [handleKeyboardHidden, handleKeyboardShown]);

  const handleBannerError = useCallback((error: string) => {
    Sentry.Browser.captureException(new Error(error));
  }, []);

  if (Platform.OS === 'web' || !showBottomAd) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.bottomBanner}
      keyboardVerticalOffset={Platform.select({ ios: 60, android: 78 })}
    >
      <AdMobBanner
        bannerSize="banner"
        adUnitID={Constants.manifest?.extra?.adUnitId}
        servePersonalizedAds
        onDidFailToReceiveAdWithError={handleBannerError}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  bottomBanner: {
    position: 'absolute',
    bottom: 0,
    width: screenWidth,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
