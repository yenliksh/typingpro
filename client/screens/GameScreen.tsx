/* eslint-disable camelcase */
import { Neucha_400Regular } from '@expo-google-fonts/neucha';
import { Orbitron_400Regular, useFonts } from '@expo-google-fonts/orbitron';
import { faker } from '@faker-js/faker';
import AppLoading from 'expo-app-loading';
import i18n from 'i18n-js';
import _ from 'lodash';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TextInputChangeEventData,
} from 'react-native';
import { GameParticipantStatusDto } from '../api/dtos/GameParticipantStatusDto';
import close from '../assets/images/close.png';
import { AnonymousModal } from '../components/game/AnonymousModal';
import { BottomAd } from '../components/game/BottomAd';
import { GameEndedModal } from '../components/game/GameEndedModal';
import { GivenText } from '../components/game/GivenText';
import {
  IPlayerPosition,
  PlayerPositions,
} from '../components/game/PlayersPositions';
import { PlayerStats } from '../components/game/PlayerStats';
import { StatusBar } from '../components/game/StatusBar';
import { View } from '../components/Themed';
import { useShowAdInterstitial } from '../hooks/useShowAdInterstitial';
import useSounds from '../hooks/useSounds';
import useUpdateFlags from '../hooks/useUpdateFlags';
import { AuthStore } from '../stores/AuthStore';
import { EStoreKeys, useResolveStore } from '../stores/di';
import { RoomStore } from '../stores/RoomStore';
import { SettingsStore } from '../stores/SettingsStore';

export interface ITextFontStyle {
  fontFamily: string;
}

export const GameScreen: React.FC<{ navigation: any }> = observer(
  ({ navigation }) => {
    const [inputText, setInputText] = useState('');
    const [index, setIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isItCorrect, setIsItCorrect] = useState(true);
    const [hasFinished, setHasFinished] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const roomStore = useResolveStore<RoomStore>(EStoreKeys.RoomStoreKey);
    const authStore = useResolveStore<AuthStore>(EStoreKeys.AuthStoreKey);
    const room = roomStore?.currentRoom?.value;
    const response = roomStore?.response?.value;
    const text = room?.text.text;
    const textArr = text?.split(' ');
    const textChars = textArr?.join('').length;
    const [statusBar, setStatusBar] = useState(
      `${Math.floor(
        ((parseInt(room?.endTimeTs ?? '0', 10) - Date.now()) / 1000) % 60
      )}`
    );
    const [textPosition, setTextPosition] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const timerRef = useRef<NodeJS.Timer>();
    const [currentTime, setCurrentTime] = useState(Date.now());
    const mistakes = useRef(0);
    const finishLine = (Dimensions.get('window').width * 80) / 100;
    const { flags, updateFlags } = useUpdateFlags();
    const [botsName, setBotsName] = useState<Record<string, string>>({});
    const [showAnonymousModal, setShowAnonymousModal] = useState(false);
    const [textStyle, setTextStyle] = useState<ITextFontStyle>();
    const {
      emitPlayGameStartsSound,
      emitPlayLoseSound,
      emitPlayPowershotSound,
      emitPlayTimerSound,
      emitPlayWinSound,
    } = useSounds();

    useShowAdInterstitial(hasFinished);

    useEffect(() => {
      SettingsStore.getAppLanguage().then((res) => {
        if (res) {
          setTextStyle({
            fontFamily: res.includes('en')
              ? 'Orbitron_400Regular'
              : 'Neucha_400Regular',
          });
        }
      });
    }, []);

    const restartGame = useCallback(async () => {
      const textLanguage = (await SettingsStore.getTextLanguage()) ?? 1;
      const newRoom = await roomStore?.findRoom(+textLanguage);
      await authStore?.getCurrentUser();
      if (
        newRoom?.isLeft &&
        newRoom.left.error.error === "User can't play more than 10 times"
      ) {
        setModalVisible(false);
        setShowAnonymousModal(true);
      } else {
        navigation.push('Game');
        setModalVisible(!modalVisible);
      }
    }, [authStore, modalVisible, navigation, roomStore]);

    useEffect(() => {
      timerRef.current = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
      emitPlayTimerSound();
    }, [emitPlayTimerSound]);

    useEffect(() => {
      if (statusBar === 'GO!') {
        emitPlayGameStartsSound();
        setTimeout(() => {
          emitPlayPowershotSound();
        }, 1000);
      }
      if (statusBar === `${i18n.t('gameFinished')}`) {
        emitPlayWinSound();
      }
      if (statusBar === `${i18n.t('gameOver')}`) {
        emitPlayLoseSound();
      }
    }, [
      statusBar,
      emitPlayGameStartsSound,
      emitPlayLoseSound,
      emitPlayPowershotSound,
      emitPlayWinSound,
    ]);

    const throttledCheckRoomStatus = useMemo(() => {
      return _.throttle((position, textAccuracy) => {
        roomStore?.checkRoomStatus(position, textAccuracy);
      }, 1000);
    }, [roomStore]);

    const accuracy = useMemo(() => {
      return Math.floor(100 - (mistakes.current / textPosition) * 100);
    }, [textPosition]);

    useEffect(() => {
      if (hasFinished) {
        return;
      }
      const waitingTimeEndTs = parseInt(room?.endTimeTs || '0', 10);
      if (waitingTimeEndTs > currentTime) {
        setStatusBar(`${Math.floor((waitingTimeEndTs - currentTime) / 1000)}`);
        throttledCheckRoomStatus(0, accuracy);
      } else {
        if (roomStore?.response?.loading || !response) {
          return;
        }
        const gameFinishTs = parseInt(response.endTimeTs || '0', 10);
        if (!hasStarted && gameFinishTs <= currentTime) {
          setStatusBar('GO!');
          return;
        }
        if (gameFinishTs > currentTime) {
          setStatusBar(`${Math.floor((gameFinishTs - currentTime) / 1000)}`);
          throttledCheckRoomStatus(textPosition, accuracy);
          setHasStarted(true);
        } else {
          throttledCheckRoomStatus(textPosition, accuracy);
          if (textArr)
            setStatusBar(
              index + 1 > textArr?.length
                ? `${i18n.t('gameFinished')}`
                : `${i18n.t('gameOver')}`
            );
          setModalVisible(true);
          setTimeout(() => {
            throttledCheckRoomStatus(textPosition, accuracy);
            clearInterval(timerRef.current as NodeJS.Timeout);
          }, 1000);
          setHasFinished(true);
        }
      }
    }, [
      currentTime,
      throttledCheckRoomStatus,
      response,
      room,
      roomStore,
      textPosition,
      hasStarted,
      index,
      textArr?.length,
      hasFinished,
      textArr,
      accuracy,
    ]);

    const winningPlace = useMemo(() => {
      if (!response || !authStore?.currentUser) {
        return 0;
      }
      const currentRoomStatus = mobx.toJS(response);
      const players = currentRoomStatus.gameParticipants;

      if (players.length === 1) {
        return 1;
      }
      let place = 0;
      players.forEach((player, ind) => {
        if (player.userId === authStore.currentUser?.value?.id) {
          place = ind + 1;
        }
      });
      return place;
    }, [authStore?.currentUser, response]);

    const cpm = useMemo(() => {
      const currentRoomStatus = mobx.toJS(response);
      if (!currentRoomStatus || !authStore?.currentUser?.value) {
        return 0;
      }
      const players = currentRoomStatus.gameParticipants;
      let cpmOfPlayer;
      players.forEach((player) => {
        if (player.userId === authStore.currentUser?.value.id) {
          cpmOfPlayer = player.cpm;
        }
      });
      return cpmOfPlayer;
    }, [authStore?.currentUser, response]);

    const generateRandomName = () => {
      let randomName = faker.name.findName().split(' ')[0];
      while (randomName.length < 4) {
        [randomName] = [faker.name.findName().split(' ')[0]];
      }
      return randomName;
    };

    const handleUpdateBotsName = useCallback(
      async (players: GameParticipantStatusDto[]) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const player of players) {
          if (botsName[player.id]) return;
          if (player.isBot) {
            const randomName = generateRandomName();
            setBotsName((prevBots) => {
              return {
                ...prevBots,
                [player.id]: randomName,
              };
            });
          }
        }
      },
      [botsName]
    );

    useEffect(() => {
      if (response?.gameParticipants) {
        updateFlags(
          response.gameParticipants.map((el) => {
            return el.user;
          })
        );
        handleUpdateBotsName(response.gameParticipants);
      }
    }, [handleUpdateBotsName, response?.gameParticipants, updateFlags]);

    const getNicknameOfPlayer = useCallback(
      (player: GameParticipantStatusDto) => {
        if (player.user?.nickname) {
          return player.user.nickname;
        }
        if (player.userId) {
          return `User №${player.userId}`;
        }
        return botsName[player.id];
      },
      [botsName]
    );

    const imageOfPlayer = useCallback(
      (player: GameParticipantStatusDto) => {
        if (player.user?.imageUrl) return player.user.imageUrl;
        if (player.user?.country) return flags[player.user.country];
        return '';
      },
      [flags]
    );

    const textPositionOfPlayer: IPlayerPosition[] = useMemo(() => {
      const currentRoomStatus = mobx.toJS(response);
      if (!currentRoomStatus || !authStore?.currentUser?.value) {
        return [
          { position: 0, nickname: '', image: '' },
          { position: 0, nickname: '', image: '' },
          { position: 0, nickname: '', image: '' },
        ];
      }
      const players = currentRoomStatus.gameParticipants;
      let positionOfPlayer;
      const playerWindowPosition: IPlayerPosition[] = [
        { position: 0, nickname: '', image: '' },
        { position: 0, nickname: '', image: '' },
        { position: 0, nickname: '', image: '' },
      ];
      players.forEach((player, ind) => {
        if (ind < 3) {
          positionOfPlayer = player.textPosition;
          if (positionOfPlayer === 0)
            playerWindowPosition[ind] = {
              position: 0,
              nickname: '',
              image: '',
            };
          if (positionOfPlayer && textChars) {
            playerWindowPosition[ind] = {
              position: (positionOfPlayer * finishLine) / textChars,
              nickname: getNicknameOfPlayer(player),
              image: imageOfPlayer(player) ?? '',
            };
          }
        }
      });
      return playerWindowPosition;
    }, [
      authStore?.currentUser?.value,
      finishLine,
      imageOfPlayer,
      getNicknameOfPlayer,
      response,
      textChars,
    ]);

    useEffect(() => {
      if (textArr)
        if (index > textArr.length - 1) {
          setStatusBar(`${i18n.t('gameFinished')}`);
          throttledCheckRoomStatus(textPosition, accuracy);
          setModalVisible(true);
          setTimeout(() => {
            throttledCheckRoomStatus(textPosition, accuracy);
            clearInterval(timerRef.current as NodeJS.Timeout);
          }, 1000);
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      accuracy,
      hasFinished,
      index,
      roomStore,
      textArr?.length,
      textPosition,
      throttledCheckRoomStatus,
    ]);

    useEffect(() => {
      if (textArr === undefined) {
        return;
      }
      if (inputText === `${textArr[index]} `) {
        setInputText('');
        setTextPosition(textPosition + textArr[index].length);
        setCharIndex(0);
        if (index === textArr.length - 1) {
          setHasFinished(true);
          setIndex(index + 1);
          return;
        }
        setIndex(index + 1);
      }
      if (hasFinished) {
        return;
      }
      const inputTextTrimmed = inputText.trim();
      if (charIndex === inputTextTrimmed.length) {
        return;
      }
      if (
        inputTextTrimmed ===
        textArr[index].substring(0, inputTextTrimmed.length)
      ) {
        setIsItCorrect(true);
      } else {
        setIsItCorrect(false);
        if (charIndex < inputTextTrimmed.length) {
          mistakes.current += 1;
        }
      }
      setCharIndex(inputTextTrimmed.length);
    }, [charIndex, hasFinished, index, inputText, textArr, textPosition]);

    const handleInputChanged = useCallback(
      (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        if (!textArr) {
          return;
        }
        const typedText = e.nativeEvent.text;
        if (typedText === undefined) {
          return;
        }
        if (
          typedText.length > textArr[index].length + 1 ||
          !hasStarted ||
          hasFinished
        ) {
          return;
        }
        setInputText(typedText);
      },
      [textArr, index, hasStarted, hasFinished]
    );

    const leaveGame = useCallback(async () => {
      if (
        !(
          statusBar === `${i18n.t('gameOver')}` ||
          statusBar === `${i18n.t('gameFinished')}`
        )
      ) {
        await roomStore?.roomLeave();
      }
      navigation.navigate('Home');
    }, [navigation, roomStore, statusBar]);

    const [hasFontsLoaded] = useFonts({
      Orbitron_400Regular,
      Neucha_400Regular,
    });

    if (!hasFontsLoaded) {
      return <AppLoading />;
    }

    return (
      <View style={styles.outerContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.innerContainer}
        >
          <AnonymousModal
            onNavigateSignup={() => {
              navigation.navigate('SignUp');
            }}
            showModal={showAnonymousModal}
          />
          <GameEndedModal
            isWinner={!(textArr && index < textArr?.length)}
            onRestartGame={restartGame}
            winningPlace={winningPlace}
            showModal={modalVisible}
          />
          <Pressable style={styles.closeBtn} onPress={() => leaveGame()}>
            <Image source={close} style={styles.closeIcon} />
          </Pressable>
          <PlayerPositions
            textPositionOfPlayer={textPositionOfPlayer}
            textStyle={textStyle}
          />
          <View style={styles.getStartedContainer}>
            <StatusBar statusBar={statusBar} />
            <GivenText
              text={text}
              indexOfWord={index}
              indexOfChar={charIndex}
              isItCorrect={isItCorrect}
            />
            <TextInput
              style={styles.inputStyle}
              value={inputText}
              onChange={handleInputChanged}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
            />
            <PlayerStats
              textStyle={textStyle}
              cpm={cpm}
              hasStarted={hasStarted}
              playersCount={response?.gameParticipants.length}
              winningPlace={winningPlace}
            />
          </View>
          <BottomAd />
        </KeyboardAvoidingView>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  outerContainer: {
    height: '100%',
    display: 'flex',
  },
  innerContainer: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  getStartedContainer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    maxHeight: '50%',
    marginHorizontal: 35,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },
  closeBtn: {
    marginTop: Platform.OS === 'ios' ? 60 : 20,
    marginLeft: 20,
    width: 20,
  },
  closeIcon: {
    width: 20,
    height: 20,
    alignSelf: 'center',
  },
  inputStyle: {
    height: 40,
    marginTop: 12,
    marginBottom: 24,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    width: '100%',
    color: '#ffffff',
    borderColor: '#ffffff',
    backgroundColor: 'transparent',
  },
});

export default GameScreen;
