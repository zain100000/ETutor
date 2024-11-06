import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  useColorScheme,
  Text,
  StatusBar,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS} from '../constants/Constants';
import auth from '@react-native-firebase/auth';

const {width, height} = Dimensions.get('window');

const Splash = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setTimeout(() => {
          navigation.replace('Main');
        }, 2000);
      } else {
        setTimeout(() => {
          navigation.replace('onBoard');
        }, 2000);
      }
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const statusBarColor =
      colorScheme === 'dark' ? COLORS.darkColor : COLORS.primary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(
      colorScheme === 'dark' ? 'light-content' : 'dark-content',
    );
  }, [colorScheme]);

  const dynamicStyles = styles(colorScheme);

  return (
    <SafeAreaView style={dynamicStyles.primaryContainer}>
      <View style={dynamicStyles.secondaryContainer}>
        <View style={dynamicStyles.imgContainer}>
          <Animatable.Image
            source={require('../../assets/splashScreen/splash-logo.png')}
            animation={'fadeIn'}
            duration={1500}
            style={dynamicStyles.Img}
          />
        </View>
        <View>
          <Text style={dynamicStyles.splashTitle}>E Tutor</Text>
          <Text style={dynamicStyles.splashDescription}>
            Connect with Qualified Tutors Anytime, Anywhere!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Splash;

const styles = colorScheme =>
  StyleSheet.create({
    primaryContainer: {
      flex: 1,
      backgroundColor:
        colorScheme === 'dark' ? COLORS.darkColor : COLORS.primary,
    },

    secondaryContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    Img: {
      width: width * 0.6,
      height: width * 0.4,
    },

    splashTitle: {
      fontSize: width * 0.09,
      color: COLORS.white,
      fontFamily: FONTS.bold,
      textAlign: 'center',
      marginBottom: height * 0.005,
    },

    splashDescription: {
      fontSize: width * 0.045,
      color: COLORS.white,
      fontFamily: FONTS.semiBold,
      textAlign: 'center',
      padding: width * 0.04,
    },
  });
