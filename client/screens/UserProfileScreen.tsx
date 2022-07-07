import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Pressable, Image } from 'react-native';
import i18n from 'i18n-js';
import { Text, View } from '../components/Themed';
import { PersonalStatsDto } from '../api/dtos/PersonalStatsDto';
import { SocialStore } from '../stores/SocialStore';
import user from '../assets/images/userBig.png';
import { EStoreKeys, useResolveStore } from '../stores/di';
import { AuthStore } from '../stores/AuthStore';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  avatar: {
    height: 200,
    width: 200,
    backgroundColor: '#efefef',
    position: 'relative',
    borderRadius: 999,
    overflow: 'hidden',
  },
  buttonBox: {
    marginTop: 20,
  },
  btnContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  linkText: {
    color: 'blue',
    marginLeft: 10,
  },
  btn: {
    backgroundColor: '#1A143B',
    paddingTop: 14,
    paddingBottom: 13,
    paddingStart: 23,
    paddingEnd: 23,
    borderRadius: 10,
    alignItems: 'center',
    width: '47%',
  },
  btnText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
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
  imageContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
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

interface IGivenUserProps {
  route: any;
  navigation: any;
}

export const UserProfileScreen: React.FC<IGivenUserProps> = observer(
  ({ route, navigation }) => {
    const authStore = useResolveStore<AuthStore>(EStoreKeys.AuthStoreKey);
    const currentUser = authStore?.currentUser?.value;
    const currentFriendStatus = SocialStore.currentFriendStatus?.value;
    const [personalStats, setPersonalStats] = useState<PersonalStatsDto>();
    const [friendRequestText, setFriendRequestText] = useState(
      i18n.t('friendRequest')
    );
    const [friendRequestFromUser, setFriendRequestFromUser] = useState(false);

    const { id } = route.params;

    useEffect(() => {
      if (id) {
        SocialStore.getPersonalStatsById(+id).then((personalStat) => {
          if (personalStat) {
            setPersonalStats(personalStat);
          }
        });
      }
    }, [id]);

    const sendOrRemoveFriendRequest = useCallback(async () => {
      if (i18n.t('requestSent') !== friendRequestText) {
        const res = await SocialStore.sendFriendRequestToUser(id);
        if (res) {
          if (!res.accepted) setFriendRequestText(i18n.t('requestSent'));
        }
      } else {
        const res = await SocialStore.removeFriendRequest(id);
        if (res) {
          setFriendRequestText(i18n.t('friendRequest'));
        }
      }
    }, [friendRequestText, id]);

    const denyFriendRequest = useCallback(async () => {
      const res = await SocialStore.denyFriendRequest(id);
      if (res) {
        setFriendRequestText(i18n.t('friendRequest'));
        setFriendRequestFromUser(false);
      }
    }, [id]);

    const acceptFriendRequest = useCallback(async () => {
      const res = await SocialStore.acceptFriendRequest(id);
      if (res) {
        setFriendRequestText(i18n.t('removeFriend'));
        setFriendRequestFromUser(false);
      }
    }, [id]);

    useEffect(() => {
      const getStatus = async () => {
        const res = await SocialStore.getFriendStatus(id);
        if (res) {
          if (res.accepted === null) {
            if (res.toUserId === id) {
              setFriendRequestText(i18n.t('requestSent'));
            } else {
              setFriendRequestText(i18n.t('acceptRequest'));
              setFriendRequestFromUser(true);
            }
          } else if (res.accepted) {
            setFriendRequestText(i18n.t('removeFriend'));
          } else if (res.accepted === false) {
            setFriendRequestText(i18n.t('friendRequest'));
          }
        }
        return res;
      };
      getStatus();
    }, [id]);

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{personalStats?.nickname} </Text>
        <View style={styles.imageContainer}>
          <Image
            style={styles.avatar}
            source={
              personalStats?.image
                ? {
                    uri: personalStats?.image,
                    cache: 'reload',
                  }
                : user
            }
          />
        </View>
        <View
          style={[
            styles.btnContainer,
            { display: currentUser?.email ? 'flex' : 'none' },
          ]}
        >
          <Pressable
            style={[
              styles.btn,
              { width: friendRequestFromUser ? '47%' : '100%' },
            ]}
            onPress={() =>
              // eslint-disable-next-line no-nested-ternary
              friendRequestFromUser
                ? acceptFriendRequest()
                : currentFriendStatus?.accepted
                ? denyFriendRequest()
                : sendOrRemoveFriendRequest()
            }
          >
            <Text style={styles.btnText}>{friendRequestText}</Text>
          </Pressable>
          <Pressable
            style={[
              styles.btn,
              { display: friendRequestFromUser ? 'flex' : 'none' },
            ]}
            onPress={() => denyFriendRequest()}
          >
            <Text style={styles.btnText}>{i18n.t('denyRequest')}</Text>
          </Pressable>
        </View>
        <View style={styles.generalSettings} />
        <View style={styles.personalStats}>
          <View style={styles.whiteBackGround}>
            <Text style={styles.personalStatsTextGray}>{i18n.t('points')}</Text>
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
      </View>
    );
  }
);

export default UserProfileScreen;
