import React, { useEffect, useState } from 'react';
import { Image, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import i18n from 'i18n-js';
import { AuthStore } from '../stores/AuthStore';
import { EStoreKeys, useResolveStore } from '../stores/di';
import user from '../assets/images/userBig.png';

export default function UploadImage() {
  const authStore = useResolveStore<AuthStore>(EStoreKeys.AuthStoreKey);
  const currentUser = authStore?.currentUser?.value;
  const [image, setImage] = useState<null | string>(null);
  const [imageUpdate, setImageUpdate] = useState(0);

  useEffect(() => {
    setImage(currentUser?.imageUrl ?? null);
  }, [currentUser]);

  const addImage = async () => {
    const imageEl = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.08,
      base64: true,
    });
    if (!imageEl.cancelled) {
      await authStore?.saveAvatar(`data:image/jpeg;base64,${imageEl.base64}`);
      setImage(currentUser?.imageUrl ?? null);
      setImageUpdate(imageUpdate + 1);
    }
  };

  return (
    <View style={imageUploaderStyles.container}>
      <Image
        source={
          image
            ? {
                uri: image,
                cache: 'reload',
              }
            : user
        }
        style={{ width: 200, height: 200 }}
      />

      <View style={imageUploaderStyles.uploadBtnContainer}>
        <TouchableOpacity
          onPress={addImage}
          style={imageUploaderStyles.uploadBtn}
        >
          <Text>{image ? `${i18n.t('edit')}` : `${i18n.t('upload')}`}</Text>
          <AntDesign name="camera" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const imageUploaderStyles = StyleSheet.create({
  container: {
    height: 200,
    width: 200,
    backgroundColor: '#efefef',
    position: 'relative',
    borderRadius: 999,
    overflow: 'hidden',
  },
  uploadBtnContainer: {
    opacity: 0.7,
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'lightgrey',
    width: '100%',
    height: '25%',
  },
  uploadBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
