import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS} from '../../constants/Constants';

const {width, height} = Dimensions.get('window');

const SubjectCard = ({subjectImage, subjectName}) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const handleCardPress = () => {
    navigation.navigate('Subject_Tutor_Profile', {subjectName});
  };

  return (
    <SafeAreaView style={styles.primaryContainer}>
      <TouchableOpacity onPress={handleCardPress} style={styles.cardContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={
              typeof subjectImage === 'string'
                ? {uri: subjectImage}
                : subjectImage
            }
            style={styles.image}
          />
        </View>
        {subjectName && (
          <Text
            style={[
              styles.subjectText,
              {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
            ]}>
            {subjectName}
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SubjectCard;

const styles = StyleSheet.create({
  primaryContainer: {
    alignItems: 'center',
    marginVertical: height * 0.015,
  },

  cardContainer: {
    width: width * 0.28,
    height: height * 0.16,
    borderRadius: width * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.01,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    marginHorizontal: width * 0.015,
  },

  imageContainer: {
    width: width * 0.15,
    height: width * 0.15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.005,
  },

  image: {
    width: width * 0.12,
    height: width * 0.12,
    resizeMode: 'contain',
  },

  subjectText: {
    fontSize: width * 0.032,
    fontFamily: FONTS.semiBold,
    textAlign: 'center',
    marginTop: height * 0.005,
  },
});
