import i18n from 'i18n-js';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { UserDto } from '../api/dtos/UserDto';
import love from '../assets/images/love.png';
import plus from '../assets/images/plus.png';
import { SpinnerLoading } from '../components/SpinnerLoading';
import { Text, View } from '../components/Themed';
import { UserSmallView } from '../components/UserSmallView';
import { COUNTRIES_LINK } from '../constants/common';
import { AuthStore } from '../stores/AuthStore';
import { EStoreKeys, useResolveStore } from '../stores/di';
import { SocialStore } from '../stores/SocialStore';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  innerContainer: {
    marginHorizontal: 30,
  },
  searchBar: {
    width: '100%',
    marginTop: 20,
    borderRadius: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  buttonBox: {
    marginTop: 20,
  },
  btnContainer: {
    marginTop: 20,
    flexDirection: 'row',
  },
  linkText: {
    color: 'blue',
    marginLeft: 10,
  },
  btn: {
    marginTop: 20,
    backgroundColor: '#1A143B',
    paddingTop: 7,
    paddingBottom: 9,
    paddingStart: 23,
    paddingEnd: 23,
    borderRadius: 10,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  inputBox: {
    flex: 1,
    display: 'flex',
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
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
  settingsBtn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'space-between',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
    backgroundColor: '#1A143B',
    paddingTop: 7,
    paddingBottom: 9,
    paddingStart: 23,
    paddingEnd: 23,
    borderRadius: 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 5,
  },
  loveIcon: {
    width: 30,
    height: 30,
    marginTop: 7,
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
  horizontalView: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 40,
  },
  loveBtn: {
    marginLeft: 15,
  },
  plusBtn: {
    marginLeft: 'auto',
  },
});

export const SocialScreen: React.FC<{ navigation: any }> = observer(
  ({ navigation }) => {
    const authStore = useResolveStore<AuthStore>(EStoreKeys.AuthStoreKey);
    const currentUser = authStore?.currentUser?.value;
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState<UserDto[]>();
    const [friends, setFriends] = useState<UserDto[]>([]);
    const [flags, setFlags] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (authStore?.currentUser?.loading) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    }, [authStore?.currentUser?.loading]);

    const handleUpdateFlags = useCallback(async (users: UserDto[]) => {
      // eslint-disable-next-line no-restricted-syntax
      for await (const userEl of users) {
        if (userEl.country) {
          const countryEl = await fetch(
            // eslint-disable-next-line max-len
            `${COUNTRIES_LINK}${userEl?.country}?fullText=true`
          ).then((res) => res.json());
          if (userEl.country) {
            setFlags((prevFlags) => ({
              ...prevFlags,
              [userEl.country!]: countryEl[0].flags.png,
            }));
          }
        }
      }
    }, []);

    useEffect(() => {
      SocialStore.getAllFriends().then((res) => {
        if (res) {
          setFriends(res);
          handleUpdateFlags(res);
        }
      });
    }, [handleUpdateFlags]);

    const onChangeSearch = async (query: string) => {
      setSearchQuery(query);
      if (query) {
        const res = friends?.filter((friend) => {
          if (friend.nickname) {
            return (
              friend.nickname.toLowerCase().indexOf(query.toLowerCase()) >= 0
            );
          }
          return false;
        });
        if (res) {
          setSearchResult(res);
        }
      } else {
        setSearchResult(undefined);
      }
    };

    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      >
        <View style={styles.container}>
          <SpinnerLoading visible={loading} />
          <View style={styles.innerContainer}>
            <View style={styles.horizontalView}>
              <Text style={styles.title}>{i18n.t('yourFriends')}</Text>
              <Pressable
                style={styles.plusBtn}
                onPress={() => navigation.navigate('SearchFriends')}
              >
                <Image source={plus} style={styles.icon} />
              </Pressable>
              <Pressable
                style={styles.loveBtn}
                onPress={() => navigation.navigate('IncomingRequests')}
              >
                <Image source={love} style={styles.loveIcon} />
              </Pressable>
            </View>
            <Searchbar
              placeholder="Search"
              onChangeText={onChangeSearch}
              value={searchQuery}
              style={styles.searchBar}
            />
            {(searchResult ?? friends)?.map((userEl) => {
              return (
                <UserSmallView
                  image={
                    userEl.imageUrl || (userEl.country && flags[userEl.country])
                  }
                  isUri={
                    !!(
                      userEl.imageUrl ||
                      (userEl.country && flags[userEl.country])
                    )
                  }
                  id={userEl.id}
                  nickname={userEl.nickname ?? ''}
                  navigation={navigation}
                  key={userEl.id}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
    );
  }
);

export default SocialScreen;
