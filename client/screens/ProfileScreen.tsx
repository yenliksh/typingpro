import i18n from 'i18n-js';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { PersonalStatsDto } from '../api/dtos/PersonalStatsDto';
import NextIcon from '../assets/images/next.png';
import { SpinnerLoading } from '../components/SpinnerLoading';
import { Text, View } from '../components/Themed';
import UploadImage from '../components/UploadImage';
import { AuthStore } from '../stores/AuthStore';
import { EStoreKeys, useResolveStore } from '../stores/di';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
    marginTop: 20,
    backgroundColor: '#1A143B',
    paddingTop: 7,
    paddingBottom: 9,
    paddingStart: 23,
    paddingEnd: 23,
    borderRadius: 10,
    marginBottom: 80,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  inputBox: {
    display: 'flex',
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
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
  settingsBtn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'space-between',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
    backgroundColor: '#1A143B',
    paddingTop: 7,
    paddingBottom: 9,
    paddingStart: 23,
    paddingEnd: 23,
    borderRadius: 10,
  },
  icon: {
    width: 30,
    height: 30,
    alignItems: 'center',
  },
  imageContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  personalStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'space-between',
    justifyContent: 'space-between',
    width: '80%',
    paddingTop: 15,
    paddingBottom: 15,
    paddingStart: 23,
    paddingEnd: 23,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  personalStatsText: {
    color: 'black',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 5,
  },
  personalStatsTextGray: {
    color: 'gray',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 5,
  },
  whiteBackGround: {
    backgroundColor: 'white',
  },
  rightAligned: {
    backgroundColor: 'white',
    alignItems: 'flex-end',
  },
  stars: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
  },
});

export const ProfileScreen: React.FC<{ navigation: any }> = observer(
  ({ navigation }) => {
    const authStore = useResolveStore<AuthStore>(EStoreKeys.AuthStoreKey);
    const currentUser = authStore?.currentUser?.value;
    const [personalStats, setPersonalStats] = useState<PersonalStatsDto>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (authStore?.currentUser?.loading) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    }, [authStore?.currentUser?.loading]);

    useEffect(() => {
      AuthStore.getPersonalStats().then((personalStat) => {
        if (personalStat) {
          setPersonalStats(personalStat);
        }
      });
    }, [authStore]);

    const signOut = useCallback(async () => {
      await AuthStore.signOut();
      navigation.navigate('Home');
    }, [navigation]);

    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      >
        <View style={styles.container}>
          <SpinnerLoading visible={loading} />
          <View style={styles.imageContainer}>
            <UploadImage />
          </View>
          <Text style={styles.title}>{currentUser?.nickname} </Text>
          <View style={styles.generalSettings} />
          <View style={styles.personalStats}>
            <View style={styles.whiteBackGround}>
              <Text style={styles.personalStatsTextGray}>
                {i18n.t('points')}
              </Text>
              <Text style={styles.personalStatsTextGray}>
                {i18n.t('cpmAverage')}
              </Text>
              <Text style={styles.personalStatsTextGray}>
                {i18n.t('playedGames')}
              </Text>
              <Text style={styles.personalStatsTextGray}>
                {i18n.t('betterThan')}
              </Text>
              <Text style={styles.personalStatsTextGray}>
                {i18n.t('accuracyAverage')}
              </Text>
            </View>
            <View style={styles.rightAligned}>
              <Text style={styles.personalStatsText}>
                {personalStats?.points ? personalStats?.points : 0}
              </Text>
              <Text style={styles.personalStatsText}>
                {personalStats?.cpmAverage ? personalStats?.cpmAverage : 0}
              </Text>
              <Text style={styles.personalStatsText}>
                {personalStats?.totalPlayedGames}
              </Text>
              <Text style={styles.personalStatsText}>
                {personalStats?.betterThanPerc}
              </Text>
              <Text style={styles.personalStatsText}>
                {personalStats?.accuracyAverage
                  ? `${personalStats?.accuracyAverage}%`
                  : `${0}%`}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => navigation.navigate('ProfileSettings')}
            style={styles.settingsBtn}
          >
            <Text style={styles.settingsText}>{i18n.t('profileSettings')}</Text>
            <Image source={NextIcon} style={styles.icon} />
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('CPMchart')}
            style={styles.settingsBtn}
          >
            <Text style={styles.settingsText}>{i18n.t('cpmChart')}</Text>
            <Image source={NextIcon} style={styles.icon} />
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('ContributionChart')}
            style={styles.settingsBtn}
          >
            <Text style={styles.settingsText}>
              {i18n.t('contributionChart')}
            </Text>
            <Image source={NextIcon} style={styles.icon} />
          </Pressable>
          <Pressable onPress={() => signOut()} style={styles.btn}>
            <Text style={styles.btnText}>{i18n.t('signOut')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }
);

export default ProfileScreen;
