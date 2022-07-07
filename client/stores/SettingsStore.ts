import { action, observable } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoreState, TStoreState } from './StoreState';

enum ECurrentSoundsEnabledStateErrors {
  Unknown = 'unknown',
}

type TCurrentSoundsEnabledState = TStoreState<
  boolean,
  ECurrentSoundsEnabledStateErrors
>;

export class SettingsStore {
  @observable public static currentSoundsEnabled: TCurrentSoundsEnabledState =
    undefined;

  @action public static async setAppSounds(turnOn: boolean) {
    try {
      await AsyncStorage.setItem('sounds', `${turnOn}`);
      const res = await AsyncStorage.getItem('sounds');
      if (res) {
        this.currentSoundsEnabled = StoreState.success<boolean>(
          res.toLowerCase() === 'true'
        );
        return 'success';
      }
      return undefined;
    } catch (e) {
      throw Error("Can't set sound");
    }
  }

  @action public static async getAppSounds() {
    try {
      const res =
        (await AsyncStorage.getItem('sounds'))?.toLowerCase() === 'true';
      this.currentSoundsEnabled = StoreState.success<boolean>(res);
      return res;
    } catch (e) {
      throw Error("Can't get sound");
    }
  }

  @action public static async setAppLanguage(translation: string) {
    try {
      await AsyncStorage.setItem('appLanguage', translation);
      return 'success';
    } catch (e) {
      throw Error("Can't set app language");
    }
  }

  @action public static async getAppLanguage() {
    try {
      const res = await AsyncStorage.getItem('appLanguage');
      return res;
    } catch (e) {
      throw Error("Can't get app language");
    }
  }

  @action public static async setTextLanguage(languageId: number) {
    try {
      await AsyncStorage.setItem('textLanguage', `${languageId}`);
      return 'success';
    } catch (e) {
      throw Error("Can't set text language");
    }
  }

  @action public static async getTextLanguage() {
    try {
      const res = await AsyncStorage.getItem('textLanguage');
      return res;
    } catch (e) {
      throw Error("Can't get text language");
    }
  }
}
