/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    type RootParamList = RootStackParamList;
  }
}

export type RootStackParamList = {
  Root: undefined;
  Home: undefined;
  Leaderboard: undefined;
  Settings: undefined;
  Modal: undefined;
  Game: undefined;
  CPMchart: undefined;
  ContributionChart: undefined;
  ProfileSettings: undefined;
  NotFound: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ResetPassword: undefined;
  Language: undefined;
  AppLanguage: undefined;
  Sounds: undefined;
  About: undefined;
  Donate: undefined;
  UserProfile: undefined;
  SearchFriends: undefined;
  IncomingRequests: undefined;
  Profile: undefined;
  Social: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  Home: undefined;
  LeaderBoard: undefined;
  Social: undefined;
  Settings: undefined;
  Profile: undefined;
  Sounds: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
