import i18n from 'i18n-js';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { SpinnerLoading } from '../components/SpinnerLoading';
import { Text } from '../components/Themed';
import useSounds from '../hooks/useSounds';
import { AuthStore } from '../stores/AuthStore';
import { EStoreKeys, useResolveStore } from '../stores/di';
import { SettingsStore } from '../stores/SettingsStore';
import { SavedModal } from '../components/settings/SavedModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#342e57',
  },
  buttonBox: {
    marginTop: 20,
  },
  btnContainer: {
    marginTop: 20,
    flexDirection: 'row',
  },
  linkText: {
    color: 'blue',
    marginLeft: 10,
  },
  btn: {
    marginTop: 10,
    backgroundColor: '#1A143B',
    paddingTop: 7,
    paddingBottom: 9,
    paddingStart: 23,
    paddingEnd: 23,
    borderRadius: 10,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    margin: 5,
  },
  inputBox: {
    flex: 1,
    display: 'flex',
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
  },
  textStyle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  close: {
    width: 17,
    height: 17,
    alignSelf: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  horizontalView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignItems: 'center',
  },
  switch: {
    height: 30,
  },
});

export const SoundsScreen: React.FC<{ navigation: any }> = observer(
  ({ navigation }) => {
    const authStore = useResolveStore<AuthStore>(EStoreKeys.AuthStoreKey);
    const currentUser = authStore?.currentUser?.value;
    const [modalVisible, setModalVisible] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const { emitPlaySavedSound, emitPlayErrorSound } = useSounds();
    const [isEnabled, setIsEnabled] = useState(true);
    const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      SettingsStore.getAppSounds().then((isTurnedOn) => {
        if (isTurnedOn !== null || undefined) {
          setIsEnabled(isTurnedOn);
        }
      });
    }, []);

    useEffect(() => {
      if (authStore?.currentUser?.loading) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    }, [authStore?.currentUser?.loading]);

    const handleSetSound = useCallback(async () => {
      setModalVisible(false);
      const res = await SettingsStore.setAppSounds(isEnabled);
      if (res) {
        await emitPlaySavedSound();
        setIsSaved(true);
        setModalVisible(true);
      } else {
        await emitPlayErrorSound();
        setIsSaved(false);
        setModalVisible(true);
      }
    }, [isEnabled, emitPlayErrorSound, emitPlaySavedSound]);

    return (
      <View style={styles.container}>
        <SpinnerLoading visible={loading} />
        <SavedModal isSaved={isSaved} showModal={modalVisible} />
        <View style={styles.horizontalView}>
          <Text style={styles.text}>{i18n.t('sounds')}</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={styles.switch}
          />
        </View>
        <View style={styles.buttonBox}>
          <Pressable
            onPress={() => {
              handleSetSound();
            }}
            style={styles.btn}
          >
            <Text style={styles.btnText}>{i18n.t('saveChanges')}</Text>
          </Pressable>
        </View>
      </View>
    );
  }
);

export default SoundsScreen;
