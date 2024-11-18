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
  ActivityIndicator,
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
  const [showTutors, setShowTutors] = useState(false);
  const [searchBorderColor, setSearchBorderColor] = useState(COLORS.lightGray);
  const [loading, setLoading] = useState(false);
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

  const handleSearch = async text => {
    setSearchQuery(text);

    if (text.trim() === '') {
      // When search text is cleared, show the subject cards again
      setShowTutors(false);
      setFilteredTutors([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const query = text.toLowerCase();

    try {
      const snapshot = await firestore().collection('tutor_profile').get();
      const tutors = snapshot.docs
        .map(doc => ({id: doc.id, ...doc.data()}))
        .filter(tutor => {
          const cityMatch = tutor.city?.toLowerCase().includes(query);
          const subjectMatch =
            tutor.tuitionSubjects &&
            Object.keys(tutor.tuitionSubjects).some(subject =>
              subject.toLowerCase().includes(query),
            );
          return cityMatch || subjectMatch;
        });

      // If no tutors found, display "No Tutor Found!"
      setFilteredTutors(tutors);
      setShowTutors(tutors.length > 0); // If tutors are found, show the tutor cards
    } catch (error) {
      console.error('Error fetching tutors:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTutorCard = ({item}) => (
    <View style={styles.cardWrapper}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Subject_Tutor_Detailed_Profile', {
            tutorId: item.tutorId,
          });
        }}>
        <View
          style={[
            styles.tutorCard,
            {
              backgroundColor:
                colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
            },
          ]}>
          <Image
            source={
              item.profileImage && typeof item.profileImage === 'string'
                ? {uri: item.profileImage}
                : imgPlaceHolder
            }
            style={styles.tutorImage}
          />
          <View style={styles.tutorInfoContainer}>
            <Text
              style={[
                styles.tutorName,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}>
              {item.fullName}
            </Text>
            <View style={styles.tutorDetailContainer}>
              <View style={styles.subDetailContainer}>
                <Text
                  style={[
                    styles.tutorText,
                    {
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                    },
                  ]}>
                  Syllabus:
                </Text>
                <View style={styles.tutorSubDetailContainer}>
                  <Text
                    style={[
                      styles.tutorSubText,
                      {
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      },
                    ]}>
                    {Object.keys(item.syllabusType).find(
                      key => item.syllabusType[key] === true,
                    )}
                  </Text>

                  <Text
                    style={[
                      styles.tutorSubText,
                      {
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      },
                    ]}>
                    {Object.keys(item.boardRegions).find(
                      key => item.boardRegions[key] === true,
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.subDetailContainer}>
                <Text
                  style={[
                    styles.tutorText,
                    {
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                    },
                  ]}>
                  Tuition:
                </Text>
                <View style={styles.tutorSubDetailContainer}>
                  <Text
                    style={[
                      styles.tutorSubText,
                      {
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      },
                    ]}>
                    {Object.keys(item.tuitionType)
                      .filter(key => item.tuitionType[key] === true)
                      .join(', ')}
                  </Text>
                </View>
              </View>

              <View style={styles.subDetailContainer}>
                <View style={styles.tutorSubDetailContainer}>
                  <Text
                    style={[
                      styles.tutorSubText,
                      {
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      },
                    ]}>
                    {item.teachingExperience}
                  </Text>
                </View>
              </View>

              <View style={styles.subDetailContainer}>
                <Text
                  style={[
                    styles.tutorText,
                    {
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                    },
                  ]}>
                  Grades:
                </Text>
                <View style={styles.tutorSubDetailContainer}>
                  <Text
                    style={[
                      styles.tutorSubText,
                      {
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      },
                    ]}>
                    {Object.keys(item.tuitionGrades)
                      .filter(key => item.tuitionGrades[key] === true)
                      .join(', ')}
                  </Text>
                </View>
              </View>

              <View style={styles.subDetailContainer}>
                <View style={styles.tutorSubDetailContainer}>
                  <Text
                    style={[
                      styles.tutorSubText,
                      {
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      },
                    ]}>
                    {item.tuitionFee}
                  </Text>
                </View>
              </View>

              <View style={styles.subDetailContainer}>
                <Text
                  style={[
                    styles.tutorText,
                    {
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                    },
                  ]}>
                  City:
                </Text>
                <View style={styles.tutorSubDetailContainer}>
                  <Text
                    style={[
                      styles.tutorSubText,
                      {
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      },
                    ]}>
                    {item.city}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
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
              placeholder="Search by city or subject"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.lightGray
              }
              onFocus={() => setSearchBorderColor(COLORS.primary)}
              onBlur={() => setSearchBorderColor(COLORS.lightGray)}
              onChangeText={handleSearch}
            />
          </View>
        </View>

        <View style={styles.subjectCardContainer}>
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator
                size={35}
                color={colorScheme === 'dark' ? COLORS.white : COLORS.primary}
              />
            </View>
          ) : (
            <>
              {showTutors ? (
                <FlatList
                  data={filteredTutors}
                  renderItem={renderTutorCard}
                  keyExtractor={item => item.id}
                  numColumns={3}
                  contentContainerStyle={styles.subjectCardList}
                  ListEmptyComponent={null}
                />
              ) : filteredTutors.length === 0 && searchQuery.trim() !== '' ? (
                <View style={styles.noTutorProfileContainer}>
                  <Text
                    style={[
                      styles.noTutorProfileText,
                      {
                        color:
                          colorScheme === 'dark'
                            ? COLORS.white
                            : COLORS.darkColor,
                      },
                    ]}>
                    No Tutor Found!
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={subjects}
                  renderItem={renderSubjectCard}
                  keyExtractor={item => item.id}
                  numColumns={3}
                  contentContainerStyle={styles.subjectCardList}
                />
              )}
            </>
          )}
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

  tutorCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.1,
    marginLeft: width * 0.24,
  },

  tutorImage: {
    width: width * 0.35,
    height: height * 0.2,
    marginLeft: width * 0.02,
  },

  tutorName: {
    fontSize: width * 0.05,
    fontFamily: FONTS.bold,
    marginBottom: height * 0.02,
    right: width * 0.05,
  },

  tutorDetailContainer: {
    marginLeft: -width * 0.05,
  },

  tutorSubDetailContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    width: width * 0.5,
    gap: width * 0.01,
  },

  subDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: width * 0.01,
  },

  tutorText: {
    fontSize: width * 0.04,
    fontFamily: FONTS.semiBold,
    marginRight: width * 0.02,
    width: width * 0.25,
  },

  tutorSubText: {
    fontSize: width * 0.04,
    fontFamily: FONTS.semiBold,
    textTransform: 'capitalize',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.55,
  },

  noTutorProfileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.55,
  },

  noTutorProfileText: {
    fontSize: width * 0.05,
    fontFamily: FONTS.semiBold,
    textAlign: 'center',
  },
});
