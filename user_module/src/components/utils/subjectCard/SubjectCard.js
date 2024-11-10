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
    flex: 1,
    alignItems: 'center',
  },

  imageContainer: {
    width: width * 0.15,
    height: height * 0.15,
  },

  image: {
    width: width * 0.15,
    height: height * 0.15,
    resizeMode: 'contain',
  },

  subjectText: {
    fontSize: width * 0.035,
    fontFamily: FONTS.semiBold,
    textAlign: 'center',
  },
});
