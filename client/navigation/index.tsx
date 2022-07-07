import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable, StyleSheet, Image } from 'react-native';
import { useRef, useCallback } from 'react';
// import * as Analytics from 'expo-firebase-analytics';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LanguageScreen from '../screens/LanguageScreen';
import AppLanguageScreen from '../screens/AppLanguageScreen';
import GameScreen from '../screens/GameScreen';
import LeaderBoardScreen from '../screens/LeaderBoardScreen';
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import SignupScreen from '../screens/SignupScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import SigninScreen from '../screens/SigninScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CPMchartScreen from '../screens/CPMchartScreen';
import ProfileSettingsScreen from '../screens/ProfileSettingsScreen';
import ContributionChartScreen from '../screens/ContributionChartScreen';
import { EStoreKeys, useResolveStore } from '../stores/di';
import { AuthStore } from '../stores/AuthStore';
import AboutScreen from '../screens/AboutScreen';
import SocialScreen from '../screens/SocialScreen';
import friendsIcon from '../assets/images/friends.png';
import friendsWhiteIcon from '../assets/images/friendsWhite.png';
import UserProfileScreen from '../screens/UserProfileScreen';
import SearchFriendsScreen from '../screens/SearchFriendsScreen';
import IncomingRequestsScreen from '../screens/IncomingRequestsScreen';
import SoundsScreen from '../screens/SoundsScreen';
import useSounds from '../hooks/useSounds';
import { HeaderGradient } from '../components/HeaderGradient';
import DonateScreen from '../screens/DonateScreen';

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef<string>();
  const { emitPlayClickSound } = useSounds();

  const handleStateChange = useCallback(async () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.getCurrentRoute()?.name;
    if (!currentRouteName) {
      return;
    }
    if (previousRouteName !== currentRouteName) {
      // await Analytics.logEvent('screen_view', {
      //   screen: currentRouteName,
      // });
      await emitPlayClickSound();
    }
    routeNameRef.current = currentRouteName;
  }, [emitPlayClickSound, navigationRef]);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.getCurrentRoute()?.name;
      }}
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      onStateChange={handleStateChange}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: 'Oops!', headerShown: false }}
      />
      <Stack.Screen
        name="Game"
        component={GameScreen}
        options={{ title: '', headerShown: false }}
      />
      <Stack.Screen
        name="CPMchart"
        component={CPMchartScreen}
        options={{
          title: `${i18n.t('cpmChart')}`,
          headerTintColor: 'white',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerBackground: () => <HeaderGradient />,
        }}
      />
      <Stack.Screen
        name="ContributionChart"
        component={ContributionChartScreen}
        options={{
          title: `${i18n.t('contributionChart')}`,
          headerTintColor: 'white',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerBackground: () => <HeaderGradient />,
        }}
      />
      <Stack.Screen
        name="SearchFriends"
        component={SearchFriendsScreen}
        options={{
          title: '',
          headerTintColor: 'white',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerBackground: () => <HeaderGradient />,
        }}
      />
      <Stack.Screen
        name="IncomingRequests"
        component={IncomingRequestsScreen}
        options={{
          title: '',
          headerTintColor: 'white',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerBackground: () => <HeaderGradient />,
        }}
      />
      <Stack.Screen
        name="ProfileSettings"
        component={ProfileSettingsScreen}
        options={{
          title: `${i18n.t('profileSettings')}`,
          headerTintColor: 'white',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerBackground: () => <HeaderGradient />,
        }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: `${i18n.t('about')}`,
          headerTintColor: 'white',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerBackground: () => <HeaderGradient />,
        }}
      />
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={{
          title: `${i18n.t('textLanguage')}`,
          headerTintColor: 'white',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerBackground: () => <HeaderGradient />,
        }}
      />
      <Stack.Screen
        name="AppLanguage"
        component={AppLanguageScreen}
        options={{
          title: `${i18n.t('appLanguage')}`,
          headerTintColor: 'white',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerBackground: () => <HeaderGradient />,
        }}
      />
      <Stack.Screen
        name="Sounds"
        component={SoundsScreen}
        options={{
          title: `${i18n.t('sounds')}`,
          headerTintColor: 'white',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerBackground: () => <HeaderGradient />,
        }}
      />
      <Stack.Screen
        name="Donate"
        component={DonateScreen}
        options={{
          title: i18n.t('donate'),
          headerTintColor: 'white',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerBackground: () => <HeaderGradient />,
        }}
      />
      <Stack.Screen
        name="SignIn"
        component={SigninScreen}
        options={{
          title: '',
          headerTintColor: 'white',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerBackground: () => <HeaderGradient />,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignupScreen}
        options={{
          title: '',
          headerTintColor: 'white',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerBackground: () => <HeaderGradient />,
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{
          title: '',
          headerTintColor: 'white',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerBackground: () => <HeaderGradient />,
        }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          title: '',
          headerTintColor: 'white',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerBackground: () => <HeaderGradient />,
        }}
      />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const authStore = useResolveStore<AuthStore>(EStoreKeys.AuthStoreKey);
  const currentUser = authStore?.currentUser?.value;

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].text,
        tabBarStyle: styles.navigationBar,
        tabBarShowLabel: false,
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        style={styles.header}
        options={({ navigation }: RootTabScreenProps<'Home'>) => ({
          headerShown: false,
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          // eslint-disable-next-line react/no-unstable-nested-components
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal')}
              style={styles.user}
            >
              <FontAwesome
                name="user"
                size={20}
                color={Colors[colorScheme].text}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="LeaderBoard"
        component={LeaderBoardScreen}
        options={{
          headerShown: false,
          unmountOnBlur: true,
          title: 'Leaderboard',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color }) => <TabBarIcon name="trophy" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Social"
        component={currentUser?.email ? SocialScreen : SearchFriendsScreen}
        options={{
          headerShown: false,
          unmountOnBlur: true,
          title: 'Social',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ focused }) => {
            return (
              <Image
                style={{ width: 30, height: 30 }}
                source={focused ? friendsIcon : friendsWhiteIcon}
              />
            );
          },
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
          title: 'Settings',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color }) => <TabBarIcon name="cogs" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={
          currentUser && !!currentUser.email ? ProfileScreen : SigninScreen
        }
        options={{
          headerShown: false,
          unmountOnBlur: true,
          title: 'Profile',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={25} style={{ marginBottom: -3 }} {...props} />;
}

const styles = StyleSheet.create({
  navigationBar: {
    backgroundColor: '#262049',
    borderRadius: 10,
    shadowColor: '#fff',
    shadowOffset: { width: -7, height: 9 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginTop: -50,
    borderColor: '#342e57',
  },
  rootNav: {
    backgroundColor: '#8F5E95',
  },
  user: {
    backgroundColor: '#f6ae96',
    padding: 10,
    paddingStart: 14,
    paddingEnd: 14,
    marginRight: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  header: {
    backgroundColor: 'transparent',
  },
  friends: {
    width: 30,
    height: 30,
  },
});
