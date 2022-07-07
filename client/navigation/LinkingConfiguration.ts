/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Language: {
            screens: {
              Language: 'five',
            },
          },
          CPMchart: {
            screens: {
              CPMchartScreen: 'six',
            },
          },
          ProfileSettings: {
            screens: {
              ProfileSettings: 'seven',
            },
          },
          ContributionChart: {
            screens: {
              ContributionChartScreen: 'eight',
            },
          },
          About: {
            screens: {
              AboutScreen: 'nine',
            },
          },
          UserProfile: {
            screens: {
              UserProfileScreen: 'eleven',
            },
          },
          SearchFriends: {
            screens: {
              SearchFriendsScreen: 'twelve',
            },
          },
          IncomingRequests: {
            screens: {
              IncomingRequestsScreen: 'thirtheen',
            },
          },
          AppLanguage: {
            screens: {
              AppLanguage: 'fourtheen',
            },
          },
          Sounds: {
            screens: {
              Sounds: 'fivetheen',
            },
          },
          Donate: {
            screens: {
              DonateScreen: 'sixteen',
            },
          },
          Game: {
            screens: {
              GameScreen: 'seventeen',
            },
          },
          Home: 'home',
          LeaderBoard: 'leaderboard',
          Settings: 'settings',
          Social: 'social',
        },
      },
      CPMchart: 'cpm-chart',
      ProfileSettings: 'profile-settings',
      ContributionChart: 'contribution-chart',
      About: 'about',
      Game: 'game',
      Donate: 'donate',
      Language: 'language',
      UserProfile: 'user-profile',
      SearchFriends: 'search-friends',
      IncomingRequests: 'incoming-requests',
      AppLanguage: 'app-language',
      Modal: 'modal',
      SignIn: 'signin',
      SignUp: 'signup',
      ResetPassword: 'reset-password',
      Profile: 'profile',
      NotFound: '*',
    },
  },
};

export default linking;
