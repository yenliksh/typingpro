import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Image, ScrollView } from 'react-native';
import i18n from 'i18n-js';
import { Text, View } from '../components/Themed';
import { SocialStore } from '../stores/SocialStore';
import { UserDto } from '../api/dtos/UserDto';
import user from '../assets/images/userLeaderboard.png';
import useUpdateFlags from '../hooks/useUpdateFlags';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  innerContainer: {
    marginHorizontal: 30,
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
  },
  acceptbtn: {
    backgroundColor: '#1A143B',
    borderWidth: 1,
    paddingTop: 7,
    paddingBottom: 9,
    paddingStart: 13,
    paddingEnd: 13,
    borderRadius: 10,
    marginLeft: 'auto',
  },
  denyBtn: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    paddingTop: 7,
    paddingBottom: 9,
    paddingStart: 13,
    paddingEnd: 13,
    borderRadius: 10,
    marginLeft: 10,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  btnTextBlack: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'black',
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
    justifyContent: 'center',
    color: 'black',
  },
  requestContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
    padding: 7,
    borderRadius: 10,
  },
  avatar: {
    height: 35,
    width: 35,
    borderRadius: 999,
    overflow: 'hidden',
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 5,
  },
  imageContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightAligned: {
    backgroundColor: 'white',
    alignItems: 'flex-end',
  },
  horizontalView: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 25,
  },
});

export const IncomingRequestsScreen: React.FC<{ navigation: any }> = observer(
  ({ navigation }) => {
    const [incomingRequests, setIncomingRequests] = useState<UserDto[]>([]);
    const { flags, updateFlags } = useUpdateFlags();

    const denyFriendRequest = useCallback(async (id) => {
      const res = await SocialStore.denyFriendRequest(id);
      if (res) {
        SocialStore.getIncomingRequests().then((incomingReq) => {
          if (incomingReq) {
            setIncomingRequests(incomingReq);
          }
        });
      }
    }, []);

    const acceptFriendRequest = useCallback(async (id) => {
      const res = await SocialStore.acceptFriendRequest(id);
      if (res) {
        SocialStore.getIncomingRequests().then((incomingReq) => {
          if (incomingReq) {
            setIncomingRequests(incomingReq);
          }
        });
      }
    }, []);

    useEffect(() => {
      SocialStore.getIncomingRequests().then((res) => {
        if (res) {
          setIncomingRequests(res);
          updateFlags(res);
        }
      });
    }, [updateFlags]);

    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      >
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <View style={styles.horizontalView}>
              <Text style={styles.title}>{i18n.t('incomingRequests')}</Text>
            </View>
            {incomingRequests.map((userEl) => {
              return (
                <Pressable
                  style={styles.requestContainer}
                  key={userEl.id}
                  onPress={() =>
                    navigation.navigate('UserProfile', { id: userEl.id })
                  }
                >
                  <Image
                    style={styles.avatar}
                    source={
                      userEl.imageUrl ||
                      (userEl?.country && flags[userEl?.country])
                        ? {
                            uri:
                              userEl.imageUrl ||
                              (userEl?.country && flags[userEl?.country]),
                            cache: 'reload',
                          }
                        : user
                    }
                  />
                  <Text style={styles.text}>
                    {userEl.nickname && `User №${userEl.id}`}
                  </Text>
                  <Pressable
                    style={styles.acceptbtn}
                    onPress={() => acceptFriendRequest(userEl.id)}
                  >
                    <Text style={styles.btnText}>
                      {i18n.t('acceptRequest')}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={styles.denyBtn}
                    onPress={() => denyFriendRequest(userEl.id)}
                  >
                    <Text style={styles.btnTextBlack}>
                      {i18n.t('denyRequest')}
                    </Text>
                  </Pressable>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    );
  }
);

export default IncomingRequestsScreen;
