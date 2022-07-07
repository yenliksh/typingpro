import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TextInput, Pressable, Modal } from 'react-native';
import i18n from 'i18n-js';
import Spinner from 'react-native-loading-spinner-overlay';
import { Text, View } from '../components/Themed';
import { AuthStore } from '../stores/AuthStore';
import { EStoreKeys, useResolveStore } from '../stores/di';
import { SelectDropdown } from '../components/SelectDropdown';
import useSounds from '../hooks/useSounds';
import { SpinnerLoading } from '../components/SpinnerLoading';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  input: {
    padding: 10,
    height: 47,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    width: '100%',
  },
  buttonBox: {
    marginTop: 20,
    zIndex: -100000,
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
    display: 'flex',
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
  },
  label: {
    marginBottom: 5,
    marginTop: 5,
    height: 20,
  },
  dropdown: {
    padding: 10,
    borderRadius: 10,
    color: 'white',
    backgroundColor: '#6C63A0',
    width: '100%',
  },
  text: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: 'bold',
  },
  generalSettings: {
    width: '80%',
    marginTop: 30,
  },
  stars: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  modalView: {
    marginTop: '25%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    width: '60%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  textStyle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalText: {
    marginTop: 10,
    fontSize: 17,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  close: {
    width: 17,
    height: 17,
    alignSelf: 'center',
  },
  okBtn: {
    marginTop: 10,
    backgroundColor: 'green',
    paddingTop: 7,
    paddingBottom: 9,
    paddingStart: 23,
    paddingEnd: 23,
    borderRadius: 10,
  },
  errorBtn: {
    marginTop: 10,
    backgroundColor: 'red',
    paddingTop: 7,
    paddingBottom: 9,
    paddingStart: 23,
    paddingEnd: 23,
    borderRadius: 10,
  },
});

const ProfileSchema = Yup.object()
  .shape({
    nickname: Yup.string()
      .min(3, 'Nickname must be at least 3 characters long')
      .required('Required'),
  })
  .required('Required');

type TProfileFormFields = Yup.InferType<typeof ProfileSchema>;
type TCountry = { name: { common: string } };

export const ProfileSettingsScreen: React.FC = observer(() => {
  const authStore = useResolveStore<AuthStore>(EStoreKeys.AuthStoreKey);
  const currentUser = authStore?.currentUser?.value;
  const initialValues: TProfileFormFields = {
    nickname: currentUser?.nickname ?? '',
  };
  const [countryList, setCountryList] = useState<TCountry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const { emitPlaySavedSound, emitPlayErrorSound } = useSounds();

  useEffect(() => {
    if (authStore?.currentUser?.loading || countryList.length === 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [authStore?.currentUser?.loading, countryList.length]);

  useEffect(() => {
    if (authStore?.currentUser?.loading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [authStore?.currentUser?.loading]);

  const handleSetNickname = useCallback(
    async (
      values: TProfileFormFields,
      actions: FormikHelpers<TProfileFormFields>
    ) => {
      actions.setSubmitting(true);
      await authStore?.saveChanges(values.nickname, selectedCountry ?? '');
      if (currentUser) {
        await emitPlaySavedSound();
        setIsSaved(true);
        setModalVisible(!modalVisible);
      } else {
        await emitPlayErrorSound();
        setIsSaved(false);
        setModalVisible(!modalVisible);
      }
      actions.setSubmitting(false);
    },
    [
      authStore,
      selectedCountry,
      currentUser,
      emitPlaySavedSound,
      modalVisible,
      emitPlayErrorSound,
    ]
  );

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then((countries) => {
        return countries.json();
      })
      .then((countries: TCountry[]) => {
        const sortedCountries = countries.sort((a, b) => {
          if (a.name.common < b.name.common) return -1;
          if (a.name.common > b.name.common) return 1;
          return 0;
        });
        setCountryList(sortedCountries);
      });
  }, []);

  return (
    <View style={styles.container}>
      <SpinnerLoading visible={loading} />
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            {isSaved
              ? i18n.t('profileSettingsSaved')
              : i18n.t('profileSettingsError')}
          </Text>
          <Pressable
            style={isSaved ? [styles.okBtn] : [styles.errorBtn]}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <Text style={styles.textStyle}>OK</Text>
          </Pressable>
        </View>
      </Modal>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={ProfileSchema}
        onSubmit={handleSetNickname}
        style={styles.form}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <View style={styles.inputBox}>
              <Text style={styles.label}>{i18n.t('nickname')}</Text>
              <TextInput
                style={styles.input}
                value={values.nickname}
                onChangeText={handleChange('nickname')}
              />
              {errors.nickname && touched.nickname && (
                <Text style={styles.error}>{errors.nickname}</Text>
              )}
            </View>
            <View style={styles.inputBox}>
              <Text style={styles.label}>{i18n.t('country')}</Text>
              <SelectDropdown
                options={countryList?.map((countryEl) => ({
                  value: countryEl.name.common,
                  label: countryEl.name.common,
                }))}
                initialValue={currentUser?.country ?? ''}
                onChangeValue={setSelectedCountry}
              />
            </View>
            <View style={styles.buttonBox}>
              <Pressable
                onPress={() => {
                  handleSubmit();
                }}
                style={styles.btn}
              >
                <Text style={styles.btnText}>{i18n.t('saveChanges')}</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
});

export default ProfileSettingsScreen;
