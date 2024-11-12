import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  useColorScheme,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {COLORS, FONTS} from '../constants/Constants';
import imgPlaceHolder from '../../assets/placeholders/default-avatar.png';
import Ionicons from 'react-native-vector-icons/Ionicons';

import mathImage from '../../assets/subjectIcons/math.png';
import quranImage from '../../assets/subjectIcons/quran.png';
import englishImage from '../../assets/subjectIcons/english.png';
import physicsImage from '../../assets/subjectIcons/physics.png';
import biologyImage from '../../assets/subjectIcons/biology.png';
import chemistryImage from '../../assets/subjectIcons/chemistry.png';
import computerImage from '../../assets/subjectIcons/computer.png';
import SubjectCard from '../utils/subjectCard/SubjectCard';

const {width, height} = Dimensions.get('window');

const Home = () => {
  const [image, setImage] = useState('');
  const [fullName, setFullName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [searchBorderColor, setSearchBorderColor] = useState(COLORS.lightGray);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const authInstance = auth();

  const fetchUserData = async () => {
    const user = authInstance.currentUser;
    if (user) {
      try {
        const userDoc = await firestore()
          .collection('app_users')
          .doc(user.uid)
          .get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          setFullName(userData.fullName);
          setImage(userData.profileImage);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        await fetchUserData();
        setLoading(false);
      };

      loadData();
    }, []),
  );

  const renderSubjectCard = ({item}) => (
    <View style={styles.cardWrapper}>
      <SubjectCard subjectImage={item.image} subjectName={item.name} />
    </View>
  );

  const subjects = [
    {id: '1', name: 'Maths', image: mathImage},
    {id: '2', name: 'Holy Quran', image: quranImage},
    {id: '3', name: 'English', image: englishImage},
    {id: '4', name: 'Physics', image: physicsImage},
    {id: '5', name: 'Biology', image: biologyImage},
    {id: '6', name: 'Chemistry', image: chemistryImage},
    {id: '7', name: 'Computer', image: computerImage},
  ];

  return (
    <SafeAreaView
      style={[
        styles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
        },
      ]}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.leftContainer}>
            <View style={styles.greetingContainer}>
              <Text
                style={[
                  styles.greeting,
                  {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
                ]}>
                Hello,
              </Text>
              <Text
                style={[
                  styles.name,
                  {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
                ]}>
                {fullName}!
              </Text>
            </View>
            <Text
              style={[
                styles.description,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Have A Nice Day!
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={styles.rightContainer}>
              <View style={styles.imgContainer}>
                {image ? (
                  <Image source={{uri: image}} style={styles.img} />
                ) : (
                  <Image source={imgPlaceHolder} style={styles.img} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchBarContainer,
              {borderColor: searchBorderColor},
            ]}>
            <Ionicons
              name="search"
              size={width * 0.045}
              color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
              style={styles.searchIcon}
            />
            <TextInput
              style={[
                styles.searchInputField,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}
              placeholder="Search!"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.lightGray
              }
              onFocus={() => setSearchBorderColor(COLORS.primary)}
              onBlur={() => setSearchBorderColor(COLORS.lightGray)}
            />
          </View>
        </View>

        <View style={styles.subjectCardContainer}>
          <FlatList
            data={subjects}
            renderItem={renderSubjectCard}
            keyExtractor={item => item.id}
            numColumns={3}
            contentContainerStyle={styles.subjectCardList}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  scrollViewContainer: {
    marginTop: height * 0.005,
  },

  headerContainer: {
    paddingHorizontal: width * 0.02,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.01,
    marginTop: height * 0.01,
  },

  leftContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: height * 0.01,
    marginLeft: height * 0.01,
  },

  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
  },

  greeting: {
    fontSize: width * 0.045,
    fontFamily: FONTS.semiBold,
  },

  name: {
    fontSize: width * 0.055,
    fontFamily: FONTS.semiBold,
  },

  description: {
    fontSize: width * 0.035,
    fontFamily: FONTS.bold,
    marginTop: width * 0.01,
  },

  rightContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  imgContainer: {
    marginTop: height * 0.02,
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: (width * 0.3) / 2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.lightGray,
  },

  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  searchContainer: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.03,
  },

  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.03,
  },

  searchInputField: {
    paddingHorizontal: width * 0.03,
    fontFamily: FONTS.semiBold,
    width: width * 0.65,
  },

  searchIcon: {
    marginRight: width * 0.01,
  },

  subjectCardContainer: {
    paddingHorizontal: width * 0.03,
    paddingTop: height * 0.02,
  },

  subjectCardList: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardWrapper: {
    width: width * 0.28,
    margin: width * 0.015,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
});
