import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import React, { useCallback, useState } from 'react';
import { StyleSheet, TextInput, Pressable } from 'react-native';
import i18n from 'i18n-js';
import Spinner from 'react-native-loading-spinner-overlay';
import { Text, View } from '../components/Themed';
import { AuthStore } from '../stores/AuthStore';
import { useAlert } from '../common-utils/Alert';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: 'red',
    margin: 5,
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
  buttonBox: {
    marginTop: 20,
  },
  btnContainer: {
    marginTop: 20,
    flexDirection: 'row',
  },
  linkText: {
    color: '#AF8090',
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
  loadingText: {
    color: '#ffffff',
  },
});

const invalidEmail = `${i18n.t('invalidEmail')}`;
const required = `${i18n.t('required')}`;
const password8Chars = `${i18n.t('password8Chars')}`;
const password1Digit = `${i18n.t('password1Digit')}`;
const password1Letter = `${i18n.t('password1Letter')}`;

const SigninSchema = Yup.object()
  .shape({
    email: Yup.string().email(invalidEmail).required(required),
    password: Yup.string()
      .min(8, password8Chars)
      .matches(/([0-9])/, password1Digit)
      .matches(/([a-z])/i, password1Letter)
      .required(required),
  })
  .required(required);

type TSigninFormFields = Yup.InferType<typeof SigninSchema>;

export default function SigninScreen({ navigation }) {
  const initialValues: TSigninFormFields = {
    email: '',
    password: '',
  };
  const [loading, setLoading] = useState(false);

  const { alert } = useAlert();

  const handleSignin = useCallback(
    async (
      values: TSigninFormFields,
      actions: FormikHelpers<TSigninFormFields>
    ) => {
      actions.setSubmitting(true);
      setLoading(true);
      const res = await AuthStore.signIn(values.email, values.password);
      setLoading(false);
      if (res.isLeft) {
        alert('Unexpected Error', 'Error during signing in', [
          { text: 'Try again', onPress: () => actions.resetForm() },
        ]);
      }
      if (res.isRight) navigation.navigate('Home');
      actions.setSubmitting(false);
    },
    [alert, navigation]
  );

  return (
    <View style={styles.container}>
      <Spinner
        visible={loading}
        textContent="Loading..."
        textStyle={styles.loadingText}
      />
      <Text style={styles.title}>{i18n.t('signin')}</Text>
      <Formik
        initialValues={initialValues}
        validationSchema={SigninSchema}
        onSubmit={handleSignin}
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
            <View style={styles.buttonBox}>
              <Pressable
                onPress={() => {
                  handleSubmit();
                }}
                style={styles.btn}
              >
                <Text style={styles.btnText}>{i18n.t('signin')}</Text>
              </Pressable>
            </View>
            <View style={styles.btnContainer}>
              <Text>{i18n.t('dontHaveAccount')} </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate('SignUp');
                }}
              >
                <Text style={styles.linkText}>{i18n.t('signup')}</Text>
              </Pressable>
            </View>
            <View style={styles.btnContainer}>
              <Text>{i18n.t('forgotPassword')} </Text>
              <Pressable onPress={() => navigation.navigate('ResetPassword')}>
                <Text style={styles.linkText}>{i18n.t('resetPassword')}</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}
