/* eslint-disable max-len */
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { initializeApp } from 'firebase/app';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Sentry from 'sentry-expo';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { RootSiblingParent } from 'react-native-root-siblings';
import useCachedResources from './hooks/useCachedResources';
import { StoresContext, initializeStores, IStoresProvider } from './stores/di';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import enTranslations from './i18n/en.json';
import ruTranslations from './i18n/ru.json';
import { SettingsStore } from './stores/SettingsStore';

(async () => {
  const appLanguage =
    (await SettingsStore.getAppLanguage()) ?? Localization.locale;

  i18n.translations = {
    en: enTranslations,
    ru: ruTranslations,
  };

  i18n.locale = appLanguage;

  i18n.fallbacks = true;
})();

Sentry.init({
  dsn: Constants.manifest?.extra?.sentryDsn,
  enableInExpoDevelopment: true,
  debug: true,
  environment: Constants.manifest?.extra?.env,
  enableNative: false,
});

export const App: React.FC = () => {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [globalStores, setGlobalStores] = useState<IStoresProvider | null>(
    null
  );

  useEffect(() => {
    initializeApp(JSON.parse(Constants.manifest?.extra?.firebaseConfig));
    const stores = initializeStores();
    setGlobalStores(stores);
  }, []);

  if (!isLoadingComplete || !globalStores) {
    return null;
  }
  return (
    <RootSiblingParent>
      <StoresContext.Provider value={globalStores}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </StoresContext.Provider>
    </RootSiblingParent>
  );
};

export default App;
