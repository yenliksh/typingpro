import { StyleSheet, Image, Pressable } from 'react-native';
import { observer } from 'mobx-react';
import i18n from 'i18n-js';
import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import { Text, View } from '../components/Themed';
import NextIcon from '../assets/images/next.png';
import planet from '../assets/images/planet.png';
import stars from '../assets/images/stars5.png';

const styles = StyleSheet.create({
  loadingText: {
    color: '#ffffff',
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 40,
  },
  getStartedContainer: {
    marginHorizontal: 35,
    alignItems: 'stretch',
    height: '100%',
    backgroundColor: 'transparent',
  },
  account: {
    marginTop: 10,
  },
  settings: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  icon: {
    width: 30,
    height: 30,
    alignItems: 'center',
  },
  settingsText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  settingsBtn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'space-between',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#1A143B',
    paddingTop: 7,
    paddingBottom: 9,
    paddingStart: 23,
    paddingEnd: 23,
    borderRadius: 10,
  },
  planet: {
    width: 170,
    height: 100,
    marginTop: 'auto',
    marginBottom: 100,
    marginRight: 0,
    alignSelf: 'flex-end',
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
});

export const SettingsScreen: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: NavigationProp<any>;
}> = observer(({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={stars} style={styles.stars} />
      <View style={styles.getStartedContainer}>
        <Text style={styles.title}>{i18n.t('settings')}</Text>
        <View style={styles.account}>
          <Pressable
            onPress={() => {
              navigation.navigate('Language');
            }}
            style={styles.settingsBtn}
          >
            <Text style={styles.settingsText}>{i18n.t('textLanguage')}</Text>
            <Image source={NextIcon} style={styles.icon} />
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate('AppLanguage');
            }}
            style={styles.settingsBtn}
          >
            <Text style={styles.settingsText}>{i18n.t('appLanguage')}</Text>
            <Image source={NextIcon} style={styles.icon} />
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate('Sounds');
            }}
            style={styles.settingsBtn}
          >
            <Text style={styles.settingsText}>{i18n.t('sounds')}</Text>
            <Image source={NextIcon} style={styles.icon} />
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('About')}
            style={styles.settingsBtn}
          >
            <Text style={styles.settingsText}>{i18n.t('about')}</Text>
            <Image source={NextIcon} style={styles.icon} />
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('Donate')}
            style={styles.settingsBtn}
          >
            <Text style={styles.settingsText}>{i18n.t('donate')}</Text>
            <Image source={NextIcon} style={styles.icon} />
          </Pressable>
        </View>
        <Image source={planet} style={styles.planet} />
      </View>
    </View>
  );
});

export default SettingsScreen;
