/* eslint-disable react/no-array-index-key */
import React, { useCallback } from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import { ITextFontStyle } from '../../screens/GameScreen';
import user from '../../assets/images/astronaut-helmet.png';
import raketa2 from '../../assets/images/raketa2.png';
import raketa3 from '../../assets/images/raketa4.png';
import raketa from '../../assets/images/raketa90.png';
import { View } from '../Themed';
import moon from '../../assets/images/moon.png';

export interface IPlayerPosition {
  position: number;
  nickname: string;
  image: string;
}

interface IPlayerPositionsProps {
  textPositionOfPlayer: IPlayerPosition[];
  textStyle?: ITextFontStyle;
}

export const PlayerPositions: React.FC<IPlayerPositionsProps> = ({
  textPositionOfPlayer,
  textStyle,
}) => {
  const handleFindImage = useCallback((index: number) => {
    if (index === 0) {
      return raketa;
    }
    if (index === 1) {
      return raketa2;
    }
    if (index === 2) {
      return raketa3;
    }
    return null;
  }, []);

  return (
    <View style={styles.container}>
      <Image source={moon} style={styles.moon} />
      {textPositionOfPlayer.map((player, index) => {
        return (
          <View
            key={index}
            style={[
              {
                transform: [
                  {
                    translateX: player.position,
                  },
                ],
              },
              styles.player,
            ]}
          >
            <View style={styles.playerImageAndNickname}>
              <Image
                source={
                  player.image
                    ? {
                        uri: player.image,
                        cache: 'reload',
                      }
                    : user
                }
                style={styles.avatar}
              />
              <Text style={[styles.playerNickname, textStyle]}>
                {player.nickname}
              </Text>
            </View>
            <Image
              source={handleFindImage(index)}
              style={{
                width: 50,
                height: 20,
              }}
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    position: 'relative',
  },
  player: {
    backgroundColor: 'transparent',
  },
  moon: {
    resizeMode: 'contain',
    flex: 1,
    height: '100%',
    width: '100%',
    right: '-50%',
    top: '-1%',
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  playerNickname: {
    color: '#18A3DF',
    fontSize: 12,
  },
  avatar: {
    width: 25,
    height: 25,
    marginBottom: 0,
    position: 'relative',
    borderRadius: 999,
    overflow: 'hidden',
    marginRight: 6,
  },
  playerImageAndNickname: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
});
