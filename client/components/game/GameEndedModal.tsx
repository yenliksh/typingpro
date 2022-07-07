import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import closeBlack from '../../assets/images/cancel-black.png';
import LosePicture from '../../assets/images/lose.png';
import WinningPicture from '../../assets/images/winning2.png';

interface IGameEndedModalProps {
  winningPlace?: number;
  isWinner?: boolean;
  onRestartGame: () => void;
  showModal: boolean;
}

export const GameEndedModal: React.FC<IGameEndedModalProps> = ({
  winningPlace,
  isWinner,
  onRestartGame,
  showModal,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (showModal) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [showModal]);

  const gameResultImage = useMemo(() => {
    if (!isWinner) {
      return LosePicture;
    }
    return WinningPicture;
  }, [isWinner]);

  const winningPlaceText = useMemo(() => {
    if (winningPlace === 1) {
      return `${i18n.t('youAre')} ${winningPlace}${i18n.t('st')}`;
    }
    if (winningPlace === 2) {
      return `${i18n.t('youAre')} ${winningPlace}${i18n.t('nd')}`;
    }
    if (winningPlace === 3) {
      return `${i18n.t('youAre')} ${winningPlace}${i18n.t('rd')}`;
    }
    if (winningPlace === (6 || 7 || 8) && Localization.locale === 'ru') {
      return `${i18n.t('youAre')} ${winningPlace}${i18n.t('nd')}`;
    }
    return `${i18n.t('youAre')} ${winningPlace}${i18n.t('th')}`;
  }, [winningPlace]);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPressOut={() => {
          setModalVisible(false);
        }}
      >
        <ScrollView directionalLockEnabled>
          <TouchableWithoutFeedback>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.btnCloseView}>
                  <Pressable
                    style={styles.btnClose}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Image source={closeBlack} style={styles.closeIcon} />
                  </Pressable>
                </View>
                <Image source={gameResultImage} style={styles.winning} />
                <Text style={styles.modalText}>
                  {!isWinner ? `${i18n.t('timeOver')}` : winningPlaceText}
                </Text>
                <Pressable
                  style={[styles.button]}
                  onPress={() => onRestartGame()}
                >
                  <Text style={styles.textStyle}>{i18n.t('restartGame')}</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </TouchableOpacity>
    </Modal>
  );
};

// TODO: create a separate modal component, duplicated with AnonymousModal
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  btnCloseView: {
    backgroundColor: 'white',
    width: '100%',
  },
  btnClose: {
    alignSelf: 'flex-start',
  },
  closeIcon: {
    width: 17,
    height: 17,
    alignSelf: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'transparent',
  },
  modalView: {
    margin: 20,
    marginTop: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    width: '100%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  button: {
    padding: 10,
    marginTop: 20,
    backgroundColor: '#18A3DF',
    paddingTop: 7,
    paddingBottom: 9,
    paddingStart: 23,
    paddingEnd: 23,
    borderRadius: 10,
  },
  textStyle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  modalText: {
    marginTop: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  winning: {
    width: 50,
    height: 50,
    alignSelf: 'center',
  },
});
