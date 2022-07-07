/* eslint-disable no-restricted-syntax */
import i18n from 'i18n-js';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { DataTable } from 'react-native-paper';
import SwitchSelector from 'react-native-switch-selector';
import usePrevious from 'react-use/lib/usePrevious';
import { TopPlayersDto } from '../api/dtos/TopPlayersDto';
import raketa from '../assets/images/raketa-50.png';
import user from '../assets/images/userLeaderboard.png';
import { SpinnerLoading } from '../components/SpinnerLoading';
import { Text, View } from '../components/Themed';
import useUpdateFlags from '../hooks/useUpdateFlags';
import { AuthStore } from '../stores/AuthStore';
import { EStoreKeys, useResolveStore } from '../stores/di';
import { LeaderBoardStore } from '../stores/LeaderBoardStore';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 40,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    alignSelf: 'center',
  },
  text: {
    color: 'white',
  },
  table: {
    marginHorizontal: 30,
    marginTop: 10,
  },
  raketa: {
    width: 110,
    height: 70,
    marginRight: 0,
    marginLeft: 20,
    marginTop: 'auto',
    marginBottom: 100,
  },
  avatar: {
    width: 20,
    height: 20,
    marginRight: 10,
    marginBottom: 0,
    backgroundColor: '#efefef',
    borderRadius: 999,
    overflow: 'hidden',
  },
  centeredCell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switcher: {
    marginHorizontal: 20,
    marginTop: 20,
  },
});

export const LeaderBoardScreen: React.FC<{ navigation: any }> = observer(
  ({ navigation }) => {
    const authStore = useResolveStore<AuthStore>(EStoreKeys.AuthStoreKey);
    const currentUser = authStore?.currentUser?.value;
    const leaderBoardStore = useResolveStore<LeaderBoardStore>(
      EStoreKeys.LeaderBoardKey
    );
    const [topPlayers, setTopPlayers] = useState<TopPlayersDto[]>();
    const topPlayersPrev = usePrevious(topPlayers);
    const [topPlayersAllTheTime, setTopPlayersAllTheTime] =
      useState<TopPlayersDto[]>();
    const topPlayerAllTheTimePrev = usePrevious(topPlayersAllTheTime);
    const [topFriends, setTopFriends] = useState<TopPlayersDto[]>();
    const topFriendsPrev = usePrevious(topFriends);
    const { flags, updateFlags } = useUpdateFlags();
    const [showPage, setShowPage] = useState(1);
    const options = [
      { label: `${i18n.t('daily')}`, value: 0 },
      { label: `${i18n.t('allTheTime')}`, value: 1 },
      { label: `${i18n.t('friends')}`, value: 2 },
    ];
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (authStore?.currentUser?.loading) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    }, [authStore?.currentUser?.loading]);

    useEffect(() => {
      LeaderBoardStore.leaderBoard().then((players) => {
        if (players) {
          setTopPlayers(players);
        }
      });
    }, [leaderBoardStore]);

    useEffect(() => {
      LeaderBoardStore.leaderBoardAllTheTime().then((players) => {
        if (players) {
          setTopPlayersAllTheTime(players);
        }
      });
    }, [leaderBoardStore]);

    useEffect(() => {
      if (currentUser?.email) {
        LeaderBoardStore.friends().then((players) => {
          if (players) {
            setTopFriends(players);
          }
        });
      }
    }, [currentUser?.email, leaderBoardStore]);

    useEffect(() => {
      if (
        topPlayers !== topPlayersPrev &&
        topPlayers &&
        topPlayers[0] !== null
      ) {
        updateFlags(topPlayers.map((topPlayer) => topPlayer.user));
      }
    }, [topPlayers, topPlayersPrev, updateFlags]);

    useEffect(() => {
      if (
        topPlayersAllTheTime !== topPlayerAllTheTimePrev &&
        topPlayersAllTheTime &&
        topPlayersAllTheTime[0] !== null
      ) {
        updateFlags(topPlayersAllTheTime.map((topPlayer) => topPlayer.user));
      }
    }, [topPlayersAllTheTime, topPlayerAllTheTimePrev, updateFlags]);

    useEffect(() => {
      if (
        topFriends !== topFriendsPrev &&
        topFriends &&
        topFriends[0] !== null
      ) {
        updateFlags(topFriends.map((topPlayer) => topPlayer.user));
      }
    }, [topFriends, topFriendsPrev, updateFlags]);

    return (
      <View style={styles.container}>
        <SpinnerLoading visible={loading} />
        <Text style={styles.title}> {i18n.t('leaderboard')}</Text>
        <SwitchSelector
          style={[styles.switcher]}
          buttonColor="#AF8090"
          backgroundColor="#997481"
          textColor="#FFFFFF"
          options={options}
          initial={1}
          onPress={(value) => setShowPage(+value)}
        />
        <View
          style={[styles.table, { display: showPage === 0 ? 'flex' : 'none' }]}
        >
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>
                <Text style={styles.text}>№</Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text style={styles.text}>{i18n.t('name')}</Text>
              </DataTable.Title>
              <DataTable.Title numeric>
                <Text style={styles.text}>Cpm</Text>
              </DataTable.Title>
            </DataTable.Header>

            {(showPage === 0 ? topPlayers : undefined)?.map(
              (topPlayer, index) => {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <DataTable.Row key={index}>
                    <DataTable.Cell>
                      <Text style={styles.text}>{index + 1}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <View style={styles.centeredCell}>
                        <Image
                          source={
                            topPlayer?.user.imageUrl || topPlayer.user.country
                              ? {
                                  uri:
                                    topPlayer?.user.imageUrl ||
                                    (topPlayer.user.country &&
                                      flags[topPlayer.user.country]),
                                  cache: 'reload',
                                }
                              : user
                          }
                          style={styles.avatar}
                        />
                        <Text style={styles.text}>
                          {topPlayer.user?.nickname ??
                            `${i18n.t('user')} №${topPlayer.user?.id}`}
                        </Text>
                      </View>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      <Text style={styles.text}>{topPlayer.cpm}</Text>
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              }
            )}
          </DataTable>
        </View>
        <View
          style={[styles.table, { display: showPage === 1 ? 'flex' : 'none' }]}
        >
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>
                <Text style={styles.text}>№</Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text style={styles.text}>{i18n.t('name')}</Text>
              </DataTable.Title>
              <DataTable.Title numeric>
                <Text style={styles.text}>Cpm</Text>
              </DataTable.Title>
            </DataTable.Header>

            {topPlayersAllTheTime?.map((topPlayerAllTheTime, index) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <DataTable.Row key={index}>
                  <DataTable.Cell>
                    <Text style={styles.text}>{index + 1}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <View style={styles.centeredCell}>
                      <Image
                        source={
                          topPlayerAllTheTime?.user.imageUrl ||
                          topPlayerAllTheTime.user.country
                            ? {
                                uri:
                                  topPlayerAllTheTime?.user.imageUrl ||
                                  (topPlayerAllTheTime.user.country &&
                                    flags[topPlayerAllTheTime.user.country]),
                                cache: 'reload',
                              }
                            : user
                        }
                        style={styles.avatar}
                      />
                      <Text style={styles.text}>
                        {topPlayerAllTheTime.user?.nickname ??
                          `${i18n.t('user')} №${topPlayerAllTheTime.user?.id}`}
                      </Text>
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text style={styles.text}>{topPlayerAllTheTime.cpm}</Text>
                  </DataTable.Cell>
                </DataTable.Row>
              );
            })}
          </DataTable>
        </View>
        <View
          style={[styles.table, { display: showPage === 2 ? 'flex' : 'none' }]}
        >
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>
                <Text style={styles.text}>№</Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text style={styles.text}>{i18n.t('name')}</Text>
              </DataTable.Title>
              <DataTable.Title numeric>
                <Text style={styles.text}>Cpm</Text>
              </DataTable.Title>
            </DataTable.Header>

            {(showPage === 2 ? topFriends : undefined)?.map(
              (topPlayer, index) => {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <DataTable.Row key={index}>
                    <DataTable.Cell>
                      <Text style={styles.text}>{index + 1}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <View style={styles.centeredCell}>
                        <Image
                          source={
                            topPlayer?.user.imageUrl || topPlayer.user.country
                              ? {
                                  uri:
                                    topPlayer?.user.imageUrl ||
                                    (topPlayer.user.country &&
                                      flags[topPlayer.user.country]),
                                  cache: 'reload',
                                }
                              : user
                          }
                          style={styles.avatar}
                        />
                        <Text style={styles.text}>
                          {topPlayer?.user?.nickname ??
                            `${i18n.t('user')} №${topPlayer?.user?.id}`}
                        </Text>
                      </View>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      <Text style={styles.text}>{topPlayer?.cpm}</Text>
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              }
            )}
          </DataTable>
        </View>
        <Image source={raketa} style={styles.raketa} />
      </View>
    );
  }
);

export default LeaderBoardScreen;
