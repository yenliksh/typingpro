import { Formik, FormikHelpers } from 'formik';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import * as Yup from 'yup';
import i18n from 'i18n-js';
import Spinner from 'react-native-loading-spinner-overlay';
import { useAlert } from '../common-utils/Alert';
import { Text, View } from '../components/Themed';
import { AuthStore } from '../stores/AuthStore';

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
    marginTop: 10,
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

const SignupSchema = Yup.object()
  .shape({
    email: Yup.string().email(invalidEmail).required(required),
  })
  .required(required);

type TSignupFormFields = Yup.InferType<typeof SignupSchema>;

export default function ResetPasswordScreen({ navigation }) {
  const initialValues: TSignupFormFields = {
    email: '',
    password: '',
    passwordConfirm: '',
  };
  const { alert } = useAlert();
  const [loading, setLoading] = useState(false);

  const handleResetPassword = useCallback(
    async (
      values: TSignupFormFields,
      actions: FormikHelpers<TSignupFormFields>
    ) => {
      actions.setSubmitting(true);
      setLoading(true);
      const res = await AuthStore.resetPassword(values.email);
      setLoading(false);
      if (res?.isLeft) {
        alert('Unexpected Error', 'Error during resetting password', [
          { text: 'Try again', onPress: () => actions.resetForm() },
        ]);
      } else {
        alert(
          `${i18n.t('emailSentSuccessfully')}`,
          `${i18n.t('resetPasswordUsingEmail')}`,
          [{ text: 'Gotcha', onPress: () => navigation.navigate('SignIn') }]
        );
      }
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
      <Text style={styles.title}>{i18n.t('resetPassword')}</Text>
      <Formik
        initialValues={initialValues}
        validationSchema={SignupSchema}
        onSubmit={handleResetPassword}
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
            <View style={styles.buttonBox}>
              <Pressable onPress={() => handleSubmit()} style={styles.btn}>
                <Text style={styles.btnText}>{i18n.t('resetPassword')}</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}
