import { useCallback } from 'react';
import { Alert, Platform } from 'react-native';

export const useAlert = () => {
  const alert = useCallback((...args: Parameters<typeof Alert.alert>) => {
    if (Platform.OS === 'web') {
      // eslint-disable-next-line no-alert
      window.alert(JSON.stringify(args));
    } else {
      Alert.alert(...args);
    }
  }, []);

  return { alert };
};
