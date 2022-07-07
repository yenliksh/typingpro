/* eslint-disable camelcase */
import {
  GloriaHallelujah_400Regular,
  useFonts,
} from '@expo-google-fonts/gloria-hallelujah';
import AppLoading from 'expo-app-loading';
import { LinearGradient } from 'expo-linear-gradient';
import i18n from 'i18n-js';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import astronaut from '../assets/images/astr4.png';
import stars from '../assets/images/stars7.png';
import { SpinnerLoading } from '../components/SpinnerLoading';
import { Text, View } from '../components/Themed';
import { AuthStore } from '../stores/AuthStore';
import { EStoreKeys, useResolveStore } from '../stores/di';
import { RoomStore } from '../stores/RoomStore';
import { SettingsStore } from '../stores/SettingsStore';
import { AnonymousModal } from '../components/game/AnonymousModal';

export const HomeScreen: React.FC<{ navigation: any }> = observer(
  ({ navigation }) => {
    const [hasFontsLoaded] = useFonts({
      GloriaHallelujah_400Regular,
    });
    const roomStore = useResolveStore<RoomStore>(EStoreKeys.RoomStoreKey);
    const authStore = useResolveStore<AuthStore>(EStoreKeys.AuthStoreKey);
    const currentUser = authStore?.currentUser?.value;
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const findRoom = useCallback(async () => {
      if (!currentUser) {
        await AuthStore.signInAnonymously();
      }
      const textLanguage = (await SettingsStore.getTextLanguage()) ?? 1;
      const room = await roomStore?.findRoom(+textLanguage);
      await authStore?.getCurrentUser();
      if (
        room?.isLeft &&
        room.left.error.error === "User can't play more than 10 times"
      ) {
        setModalVisible(true);
      } else if (roomStore?.currentRoom?.type === 'success') {
        navigation.navigate('Game');
      }
    }, [authStore, currentUser, navigation, roomStore]);

    useEffect(() => {
      if (authStore?.currentUser?.loading) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    }, [authStore?.currentUser?.loading, navigation]);

    if (!hasFontsLoaded) {
      return <AppLoading />;
    }

    return (
      <LinearGradient
        colors={['#1A143B', '#8F5E95']}
        start={{
          x: 0,
          y: 0,
        }}
        end={{
          x: 1,
          y: 1,
        }}
        style={styles.box}
      >
        <View style={styles.container}>
          <SpinnerLoading visible={loading} />
          <Image source={stars} style={styles.stars} />
          <AnonymousModal
            onNavigateSignup={() => {
              navigation.navigate('SignUp');
            }}
            showModal={modalVisible}
          />
          <Text style={styles.title}>
            {i18n.t('welcome')}
            {currentUser?.nickname ? `,  ${currentUser?.nickname}!` : ' !'}
          </Text>
          <View style={styles.getStartedContainer}>
            <Image source={astronaut} style={styles.astr} />
            <Pressable style={styles.btn} onPress={() => findRoom()}>
              <Text style={styles.btnText}> {i18n.t('play')}</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    );
  }
);

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    height: '100%',
  },
  box: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginHorizontal: 30,
    textAlign: 'center',
    fontFamily: 'GloriaHallelujah_400Regular',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  astr: {
    width: 270,
    height: 250,
    marginBottom: 10,
    marginTop: 20,
  },
  user: {
    width: 30,
    height: 30,
  },
  userBtn: {
    marginLeft: 'auto',
    marginRight: 15,
    marginTop: 15,
  },
  btn: {
    marginTop: 40,
    backgroundColor: '#1A143B',
    paddingTop: 3,
    paddingBottom: 5,
    paddingStart: 25,
    paddingEnd: 37,
    borderRadius: 10,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'GloriaHallelujah_400Regular',
  },
  getStartedContainer: {
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  btnCloseView: {
    backgroundColor: 'white',
    width: '100%',
  },
  btnClose: {
    alignSelf: 'flex-start',
  },
  close: {
    width: 17,
    height: 17,
    alignSelf: 'center',
  },
  textStyle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalText: {
    marginTop: 40,
    fontSize: 17,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
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

export default HomeScreen;
