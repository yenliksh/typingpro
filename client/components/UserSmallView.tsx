import React from 'react';
import { Image, Text, StyleSheet, Pressable } from 'react-native';
import user from '../assets/images/userBig.png';

interface IGivenUserProps {
  id: number;
  image: string | undefined;
  isUri: boolean;
  nickname: string;
  navigation: any;
}

export const UserSmallView: React.FC<IGivenUserProps> = ({
  id,
  image,
  isUri,
  nickname,
  navigation,
}) => {
  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate('UserProfile', { id })}
    >
      <Image
        style={styles.avatar}
        source={isUri ? { uri: image, cache: 'reload' } : user}
      />
      <Text style={styles.text}>{nickname}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
    padding: 5,
    borderRadius: 15,
  },
  avatar: {
    height: 55,
    width: 55,
    borderRadius: 999,
    overflow: 'hidden',
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 20,
    justifyContent: 'center',
  },
});
