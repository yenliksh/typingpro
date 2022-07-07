import * as Updates from 'expo-updates';
import i18n from 'i18n-js';
import { observer } from 'mobx-react';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SelectDropdown } from '../components/SelectDropdown';
import { SavedModal } from '../components/settings/SavedModal';
import { Text } from '../components/Themed';
import useSounds from '../hooks/useSounds';
import { SettingsStore } from '../stores/SettingsStore';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#342e57',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  buttonBox: {
    marginTop: 20,
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
  textStyle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export const AppLanguageScreen: React.FC = observer(() => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(i18n.currentLocale().substring(0, 2));
  const [items, setItems] = useState(
    Object.keys(i18n.translations).map((translation) => ({
      label: i18n.t(translation),
      value: translation,
    }))
  );
  const { emitPlaySavedSound, emitPlayErrorSound } = useSounds();

  const handleSaveLanguage = useCallback(async () => {
    setModalVisible(false);
    const res = await SettingsStore.setAppLanguage(value);
    if (res) {
      await emitPlaySavedSound();
      setIsSaved(true);
      setModalVisible(true);
      Updates.reloadAsync();
    } else {
      await emitPlayErrorSound();
      setIsSaved(false);
      setModalVisible(true);
    }
  }, [emitPlayErrorSound, emitPlaySavedSound, value]);

  return (
    <View style={styles.container}>
      <SavedModal isSaved={isSaved} showModal={modalVisible} />
      <View style={styles.form}>
        <SelectDropdown
          options={Object.keys(i18n.translations).map((translation) => ({
            label: i18n.t(translation),
            value: translation,
          }))}
          initialValue={i18n.currentLocale().substring(0, 2)}
          onChangeValue={setValue}
        />
        <View style={styles.buttonBox}>
          <Pressable onPress={handleSaveLanguage} style={styles.btn}>
            <Text style={styles.btnText}>{i18n.t('saveChanges')}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
});

export default AppLanguageScreen;
