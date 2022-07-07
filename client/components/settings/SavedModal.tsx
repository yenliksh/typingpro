import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import i18n from 'i18n-js';

interface ISavedModal {
  isSaved?: boolean;
  showModal: boolean;
}

export const SavedModal: React.FC<ISavedModal> = ({ isSaved, showModal }) => {
  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    if (showModal !== null || undefined) {
      setModalVisible(showModal);
    }
  }, [showModal]);

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
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                {isSaved
                  ? i18n.t('textLanguageSaved')
                  : i18n.t('textLanguageError')}
              </Text>
              <Pressable
                style={isSaved ? [styles.okBtn] : [styles.errorBtn]}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text style={styles.textStyle}>OK</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalView: {
    marginTop: '30%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    width: '100%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  modalText: {
    marginTop: 10,
    fontSize: 17,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  errorBtn: {
    marginTop: 10,
    backgroundColor: 'red',
    paddingTop: 7,
    paddingBottom: 9,
    paddingStart: 23,
    paddingEnd: 23,
    borderRadius: 10,
  },
  okBtn: {
    marginTop: 10,
    backgroundColor: 'green',
    paddingTop: 7,
    paddingBottom: 9,
    paddingStart: 23,
    paddingEnd: 23,
    borderRadius: 10,
  },
});
