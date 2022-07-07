import i18n from 'i18n-js';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LanguageDto } from '../api/dtos/LanguageDto';
import { SelectDropdown } from '../components/SelectDropdown';
import { SavedModal } from '../components/settings/SavedModal';
import { SpinnerLoading } from '../components/SpinnerLoading';
import { Text } from '../components/Themed';
import useSounds from '../hooks/useSounds';
import { AuthStore } from '../stores/AuthStore';
import { EStoreKeys, useResolveStore } from '../stores/di';
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
  error: {
    color: 'red',
    margin: 5,
  },
  label: {
    marginBottom: 5,
    marginTop: 5,
  },
  dropdown: {
    padding: 10,
    borderRadius: 10,
    color: 'white',
    backgroundColor: '#6C63A0',
    width: '100%',
  },
  textStyle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export const LanguageScreen: React.FC = observer(() => {
  const authStore = useResolveStore<AuthStore>(EStoreKeys.AuthStoreKey);
  const [initialLanguageId, setInitialLanguageId] = useState<number | null>(1);
  const [languageId, setLanguageId] = useState<number | null>();
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { emitPlaySavedSound, emitPlayErrorSound } = useSounds();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authStore?.currentUser?.loading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [authStore?.currentUser?.loading]);

  useEffect(() => {
    AuthStore.getAllTextLanguages().then((allLanguages) => {
      if (allLanguages) {
        setLanguages(allLanguages);
      }
    });
  }, [authStore]);

  useEffect(() => {
    SettingsStore.getTextLanguage().then((lang) => {
      if (lang) {
        setInitialLanguageId(parseInt(lang, 10) ?? 1);
      }
    });
  }, [authStore]);

  const handleSaveLanguage = useCallback(async () => {
    if (!languageId) {
      return;
    }
    setModalVisible(false);
    const res = await SettingsStore.setTextLanguage(languageId);
    if (res) {
      await emitPlaySavedSound();
      setIsSaved(true);
      setModalVisible(true);
    } else {
      await emitPlayErrorSound();
      setIsSaved(false);
      setModalVisible(true);
    }
  }, [emitPlayErrorSound, emitPlaySavedSound, languageId]);

  return (
    <View style={styles.container}>
      <SpinnerLoading visible={loading} />
      <SavedModal isSaved={isSaved} showModal={modalVisible} />
      <SpinnerLoading visible={loading} />
      <View style={styles.form}>
        <SelectDropdown
          options={languages?.map((language) => ({
            value: language.id,
            label: language.language,
          }))}
          initialValue={initialLanguageId}
          onChangeValue={setLanguageId}
        />
        <View style={styles.buttonBox}>
          <Pressable
            onPress={() => {
              handleSaveLanguage();
            }}
            style={styles.btn}
          >
            <Text style={styles.btnText}>{i18n.t('saveChanges')}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
});

export default LanguageScreen;
