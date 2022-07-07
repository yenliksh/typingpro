/* eslint-disable camelcase */
import i18n from 'i18n-js';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import closeBlack from '../../assets/images/cancel-black.png';
import { View } from '../Themed';

interface IAnonymousModalProps {
  onNavigateSignup: () => void;
  showModal: boolean;
}

export const AnonymousModal: React.FC<IAnonymousModalProps> = ({
  onNavigateSignup,
  showModal,
}) => {
  const [anonymousModal, setAnonymousModal] = useState(false);

  useEffect(() => {
    if (showModal) {
      setAnonymousModal(true);
    } else {
      setAnonymousModal(false);
    }
  }, [showModal]);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={anonymousModal}
      onRequestClose={() => {
        setAnonymousModal(!anonymousModal);
      }}
      style={styles.anonymousModal}
    >
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPressOut={() => {
          setAnonymousModal(false);
        }}
      >
        <ScrollView directionalLockEnabled>
          <TouchableWithoutFeedback>
            <View style={styles.anonymousModalView}>
              <View style={styles.btnCloseView}>
                <Pressable
                  style={styles.btnClose}
                  onPress={() => setAnonymousModal(!anonymousModal)}
                >
                  <Image source={closeBlack} style={styles.closeIcon} />
                </Pressable>
              </View>
              <Text style={styles.modalText}>
                {i18n.t('anonymousUserTotalGamesWarning')}
              </Text>
              <Pressable
                style={[styles.button]}
                onPress={() => {
                  onNavigateSignup();
                  setAnonymousModal(!anonymousModal);
                }}
              >
                <Text style={styles.textStyle}> {i18n.t('signup')}</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  anonymousModalView: {
    marginTop: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    width: '80%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  anonymousModal: {
    position: 'absolute',
    marginTop: '40%',
    alignSelf: 'center',
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
    marginTop: 25,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
