import { observer } from 'mobx-react';
import { Pressable, StyleSheet, Image, Linking } from 'react-native';
import i18n from 'i18n-js';
import React, { useState } from 'react';
import { Text, View } from '../components/Themed';
import sputnik from '../assets/images/sputnik30.png';
import { CONTACT_FORM } from '../constants/common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 50,
    alignSelf: 'flex-start',
  },
  text: {
    marginTop: 40,
    fontSize: 17,
    fontWeight: 'bold',
    lineHeight: 23,
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
  innerContainer: {
    marginHorizontal: 40,
    alignItems: 'center',
  },
  btn: {
    marginTop: 20,
    backgroundColor: '#1A143B',
    paddingTop: 11,
    paddingBottom: 13,
    paddingStart: 23,
    paddingEnd: 23,
    borderRadius: 10,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sputnik: {
    position: 'absolute',
    top: 10,
    right: 0,
    width: 100,
    height: 100,
  },
});

export const AboutScreen: React.FC = observer(() => {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Image source={sputnik} style={styles.sputnik} />
        <Text style={styles.title}>TypingPro</Text>
        <Text style={styles.text}>{i18n.t('aboutUs')}</Text>
        <Pressable
          onPress={() => Linking.openURL(CONTACT_FORM)}
          style={styles.btn}
        >
          <Text style={styles.btnText}>{i18n.t('contactUs')}</Text>
        </Pressable>
      </View>
    </View>
  );
});

export default AboutScreen;
