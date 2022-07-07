import { Formik, FormikHelpers } from 'formik';
import React, { useCallback, useState } from 'react';
import { StyleSheet, TextInput, Pressable } from 'react-native';
import * as Yup from 'yup';
import i18n from 'i18n-js';
import Spinner from 'react-native-loading-spinner-overlay';
import { useAlert } from '../common-utils/Alert';
import { Text, View } from '../components/Themed';
import { AuthStore } from '../stores/AuthStore';
import { EStoreKeys, useResolveStore } from '../stores/di';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  inputBox: {
    display: 'flex',
    marginTop: 15,
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
  },
  label: {
    marginBottom: 5,
  },
  input: {
    borderColor: 'grey',
    borderWidth: StyleSheet.hairlineWidth,
    padding: 10,
    height: 35,
    borderRadius: 10,
    color: 'white',
    backgroundColor: '#6C63A0',
    width: '100%',
  },
  error: {
    color: 'red',
    margin: 5,
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
  loadingText: {
    color: '#ffffff',
  },
});

const invalidEmail = `${i18n.t('invalidEmail')}`;
const required = `${i18n.t('required')}`;
const password8Chars = `${i18n.t('password8Chars')}`;
const password1Digit = `${i18n.t('password1Digit')}`;
const password1Letter = `${i18n.t('password1Letter')}`;
const passwordMatch = `${i18n.t('passwordMatch')}`;

const SignupSchema = Yup.object()
  .shape({
    email: Yup.string().email(invalidEmail).required(required),
    password: Yup.string()
      .min(8, password8Chars)
      .matches(/([0-9])/, password1Digit)
      .matches(/([a-z])/i, password1Letter)
      .required(required),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password'), null], passwordMatch)
      .required(required),
  })
  .required(required);

type TSignupFormFields = Yup.InferType<typeof SignupSchema>;

export default function SignupScreen({ navigation }) {
  const initialValues: TSignupFormFields = {
    email: '',
    password: '',
    passwordConfirm: '',
  };
  const { alert } = useAlert();
  const authStore = useResolveStore<AuthStore>(EStoreKeys.AuthStoreKey);
  const [loading, setLoading] = useState(false);
  const handleSignup = useCallback(
    async (
      values: TSignupFormFields,
      actions: FormikHelpers<TSignupFormFields>
    ) => {
      if (!authStore) {
        return;
      }
      actions.setSubmitting(true);
      setLoading(true);
      const res = await authStore.signUp(values.email, values.password);
      setLoading(false);
      if (res.isLeft) {
        alert('Unexpected Error', 'Error during signing up', [
          { text: 'Try again', onPress: () => actions.resetForm() },
        ]);
      }
      if (res.isRight) navigation.navigate('Home');
      actions.setSubmitting(false);
    },
    [alert, authStore, navigation]
  );

  return (
    <View style={styles.container}>
      <Spinner
        visible={loading}
        textContent="Loading..."
        textStyle={styles.loadingText}
      />
      <Text style={styles.title}>{i18n.t('signup')}</Text>
      <Formik
        initialValues={initialValues}
        validationSchema={SignupSchema}
        onSubmit={handleSignup}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.form}>
            <View style={styles.inputBox}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
              />
              {errors.email && touched.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}
            </View>
            <View style={styles.inputBox}>
              <Text style={styles.label}>{i18n.t('password')}</Text>
              <TextInput
                style={styles.input}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry
              />
              {errors.password && touched.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}
            </View>
            <View style={styles.inputBox}>
              <Text style={styles.label}>{i18n.t('passwordConfirmation')}</Text>
              <TextInput
                style={styles.input}
                value={values.passwordConfirm}
                onChangeText={handleChange('passwordConfirm')}
                onBlur={handleBlur('passwordConfirm')}
                secureTextEntry
              />
              {errors.passwordConfirm && touched.passwordConfirm && (
                <Text style={styles.error}>{errors.passwordConfirm}</Text>
              )}
            </View>
            <View style={styles.buttonBox}>
              <Pressable
                onPress={() => {
                  handleSubmit();
                }}
                style={styles.btn}
              >
                <Text style={styles.btnText}>{i18n.t('signup')}</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}
