import { AdMobInterstitial } from 'expo-ads-admob';
import Constants from 'expo-constants';
import { useCallback, useEffect } from 'react';
import { SHOW_INTERSTITIAL_AD_AFTER_EVERY_NO_GAMES } from '../constants/common';
import { RoomStore } from '../stores/RoomStore';

export const useShowAdInterstitial = (hasFinished: boolean) => {
  const handleShowAddIfFinished = useCallback(async () => {
    const totalGames = await RoomStore.getTotalPlayedGames();
    RoomStore.setTotalPlayedGames(totalGames + 1);
    if (totalGames % SHOW_INTERSTITIAL_AD_AFTER_EVERY_NO_GAMES === 0) {
      await AdMobInterstitial.setAdUnitID(
        Constants.manifest?.extra?.interstitialAdUnitId
      );
      await AdMobInterstitial.requestAdAsync();
      await AdMobInterstitial.showAdAsync();
    }
  }, []);

  useEffect(() => {
    if (hasFinished) {
      handleShowAddIfFinished();
    }
  }, [handleShowAddIfFinished, hasFinished]);
};
