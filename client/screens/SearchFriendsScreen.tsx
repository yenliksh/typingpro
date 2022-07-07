import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import i18n from 'i18n-js';
import { Text, View } from '../components/Themed';
import { SocialStore } from '../stores/SocialStore';
import { UserDto } from '../api/dtos/UserDto';
import { UserSmallView } from '../components/UserSmallView';
import user from '../assets/images/userLeaderboard.png';
import useUpdateFlags from '../hooks/useUpdateFlags';
import { EStoreKeys, useResolveStore } from '../stores/di';
import { AuthStore } from '../stores/AuthStore';

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
    marginTop: 30,
  },
  loveBtn: {
    marginLeft: 15,
  },
  plusBtn: {
    marginLeft: 'auto',
  },
});

export const SearchFriendsScreen: React.FC<{ navigation: any }> = observer(
  ({ navigation }) => {
    const authStore = useResolveStore<AuthStore>(EStoreKeys.AuthStoreKey);
    const currentUser = authStore?.currentUser?.value;
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState<UserDto[]>([]);
    const { flags, updateFlags } = useUpdateFlags();
    const onChangeSearch = async (query: string) => {
      setSearchQuery(query);
      if (query) {
        const res = await SocialStore.getUsersByNickname(
          query,
          currentUser?.id
        );
        if (res) {
          setSearchResult(res);
          updateFlags(res);
        }
      } else {
        setSearchResult([]);
      }
    };

    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      >
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <View style={styles.horizontalView}>
              <Text style={styles.title}>{i18n.t('findYourFriend')}</Text>
            </View>
            <Searchbar
              placeholder="Search"
              onChangeText={onChangeSearch}
              value={searchQuery}
              style={styles.searchBar}
            />
            {searchResult?.map((userEl) => {
              return (
                <UserSmallView
                  image={
                    userEl.imageUrl ||
                    (userEl.country && flags[userEl.country]) ||
                    user
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

export default SearchFriendsScreen;
