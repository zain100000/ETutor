import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  useColorScheme,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS, FONTS} from '../constants/Constants';
import Home from '../screens/Home';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();
const {width, height} = Dimensions.get('window');

const BottomNavigator = () => {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.lightGray,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor:
              colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused}) => (
            <View style={styles.imageContainer}>
              <Image
                source={
                  focused
                    ? require('../../assets/navigatorIcons/home-fill.png')
                    : require('../../assets/navigatorIcons/home.png')
                }
                style={[
                  styles.image,
                  {tintColor: focused ? COLORS.primary : COLORS.lightGray},
                ]}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({focused}) => (
            <View style={styles.imageContainer}>
              <Image
                source={
                  focused
                    ? require('../../assets/navigatorIcons/profile-fill.png')
                    : require('../../assets/navigatorIcons/profile.png')
                }
                style={[
                  styles.image,
                  {tintColor: focused ? COLORS.primary : COLORS.lightGray},
                ]}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  tabBar: {
    height: height * 0.08,
    elevation: 8,
  },

  tabBarLabel: {
    fontSize: width * 0.035,
    fontFamily: FONTS.bold,
    marginBottom: height * 0.01,
  },

  imageContainer: {
    marginTop: height * 0.01,
  },

  image: {
    width: width * 0.07,
    height: height * 0.04,
    resizeMode: 'contain',
  },
});
