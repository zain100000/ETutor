import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS} from '../constants/Constants';

const {width, height} = Dimensions.get('window');

const About = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={[
        styles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
        },
      ]}>
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor:
              colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          },
        ]}>
        <TouchableOpacity onPress={() => navigation.goBack('Home')}>
          <Feather
            name="chevron-left"
            size={30}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.headerTextContainer}>
        <Text
          style={[
            styles.headerTitleText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          E-Tutor
        </Text>
        <Text
          style={[
            styles.headerDescriptionText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Your on-demand tutoring solution.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text
          style={[
            styles.heading,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          What We Offer
        </Text>
        <Text
          style={[
            styles.description,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          ETutor is designed to make the process of finding tutors simple and
          efficient. With ETutor, you can:
        </Text>
        <View style={styles.bulletContainer}>
          <Feather
            name="check-circle"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            Easily search for tutors across various subjects and expertise
            levels
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <Feather
            name="check-circle"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            Connect with qualified tutors on-demand based on your preferences
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <Feather
            name="check-circle"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            Access affordable and flexible tutoring options
          </Text>
        </View>

        <Text
          style={[
            styles.heading,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          Key Features
        </Text>
        <View style={styles.bulletContainer}>
          <Feather
            name="search"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            Quick and easy tutor search with advanced filters
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <Feather
            name="star"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            View ratings and reviews to choose the best tutor for your needs
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <Feather
            name="calendar"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            Schedule sessions at your convenience
          </Text>
        </View>

        <Text
          style={[
            styles.heading,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          Our Commitment
        </Text>
        <Text
          style={[
            styles.description,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          At ETutor, we are dedicated to making quality tutoring accessible to
          everyone. Our goal is to bridge the gap between students and expert
          tutors, empowering learners to excel in their academic journey.
        </Text>
        <Text
          style={[
            styles.description,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          Thank you for choosing ETutor as your learning partner. We are here to
          support you every step of the way.
        </Text>

        <Text
          style={[
            styles.heading,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          Contact Us
        </Text>
        <Text
          style={[
            styles.description,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          For any questions or assistance, reach out to us at:
        </Text>
        <View style={styles.contactContainer}>
          <Feather
            name="mail"
            size={20}
            color={COLORS.primary}
            style={styles.contactIcon}
          />
          <Text
            style={[
              styles.contactText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            etutor.support@gmail.com
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default About;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.05,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gray,
  },

  headerTextContainer: {
    marginTop: height * 0.12,
    marginHorizontal: width * 0.05,
  },

  headerTitleText: {
    fontSize: width * 0.08,
    color: COLORS.dark,
    fontFamily: FONTS.bold,
  },

  headerDescriptionText: {
    color: COLORS.dark,
    fontSize: width * 0.04,
    fontFamily: FONTS.medium,
    textAlign:'justify'
  },

  contentContainer: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.03,
  },

  heading: {
    fontSize: width * 0.06,
    fontFamily: FONTS.semiBold,
    marginVertical: height * 0.02,
  },

  description: {
    fontSize: width * 0.045,
    fontFamily: FONTS.regular,
    marginBottom: height * 0.02,
    lineHeight: width * 0.06,
    textAlign:'justify'
  },

  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },

  bulletIcon: {
    marginRight: width * 0.03,
  },

  bulletText: {
    fontSize: width * 0.045,
    fontFamily: FONTS.regular,
    lineHeight: width * 0.06,
    flex: 1,
  },

  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.03,
  },

  contactIcon: {
    marginRight: width * 0.03,
  },

  contactText: {
    fontSize: width * 0.045,
    fontFamily: FONTS.regular,
    lineHeight: width * 0.06,
  },
});
