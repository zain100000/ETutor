import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Image,
  FlatList,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {COLORS, FONTS} from '../../constants/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import imgPlaceHolder from '../../../assets/placeholders/default-avatar.png';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import TutorRatingModal from '../modals/TutorRatingModal';

const {width, height} = Dimensions.get('window');

const SubjectTutorDetailedProfile = () => {
  const route = useRoute();
  const {tutorId} = route.params;
  const [tutorData, setTutorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchTutorDetails = async () => {
      try {
        setLoading(true);
        const tutorDoc = await firestore()
          .collection('tutor_profile')
          .doc(tutorId)
          .get();
        if (tutorDoc.exists) {
          setTutorData(tutorDoc.data());
          console.log('Tutor Data:', tutorDoc.data());
        } else {
          console.error('Tutor profile not found');
        }
      } catch (error) {
        console.error('Error fetching tutor details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorDetails();
  }, [tutorId]);

  const gradeNames = {
    high: 'High (9th-10th)',
    intermediate: 'Intermediate (11th-12th)',
    oLevel: 'O Level',
    aLevel: 'A Level',
    primary: 'Primary',
    middle: 'Middle',
    playGroup: 'Play Group',
    allGrades: 'All Grades',
  };

  const selectedGrades = tutorData
    ? Object.keys(tutorData.tuitionGrades || {})
        .filter(gradeKey => tutorData.tuitionGrades[gradeKey])
        .map(gradeKey => gradeNames[gradeKey])
    : [];

  const subjectsNames = {
    math: 'Math',
    science: 'Science',
    holyQuran: 'Holy Quran',
    physics: 'Physics',
    chemistry: 'Chemistry',
    biology: 'Biology',
    computerScience: 'Computer Science',
    english: 'English',
    allScienceSubjects: 'All Science Subjects',
    artSubjects: 'Art Subjects',
  };

  const selectedSubjects = tutorData
    ? Object.keys(tutorData.tuitionSubjects || {})
        .filter(subjectKey => tutorData.tuitionSubjects[subjectKey])
        .map(subjectKey => subjectsNames[subjectKey])
    : [];

  const handleChatBox = () => {
    const studentId = auth().currentUser.uid;
    console.log('Student Id:', studentId);
    console.log('Tutor Id:', tutorId);
    navigation.navigate('Chat_Box', {tutorId, studentId});
  };

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
        <TouchableOpacity onPress={() => navigation.goBack('')}>
          <Ionicons
            name="chevron-back"
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
          {tutorData?.fullName} Profile
        </Text>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size={35}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.primary}
          />
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.profileHeaderContainer}>
              <View style={styles.profileLeftContainer}>
                <View style={styles.imgContainer}>
                  {tutorData?.profileImage ? (
                    <Image
                      source={{uri: tutorData.profileImage}}
                      style={styles.img}
                    />
                  ) : (
                    <Image source={imgPlaceHolder} style={styles.img} />
                  )}
                </View>
                <Text
                  style={[
                    styles.name,
                    {
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                    },
                  ]}>
                  {tutorData?.fullName}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.subCardContainer,
                {
                  backgroundColor:
                    colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
                },
              ]}>
              <View style={styles.subCardLeftContent}>
                <View style={styles.subCardIconContainer}>
                  <Ionicons
                    name="briefcase-outline"
                    size={20}
                    style={[
                      styles.subCardIcon,
                      {
                        color:
                          colorScheme === 'dark'
                            ? COLORS.white
                            : COLORS.primary,
                      },
                    ]}
                  />
                </View>
                <View style={styles.subCardTextContainer}>
                  <Text
                    style={[
                      styles.subCardText,
                      {
                        color:
                          colorScheme === 'dark'
                            ? COLORS.white
                            : COLORS.primary,
                      },
                    ]}>
                    {tutorData?.teachingExperience}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.verticalDivider,
                  {
                    backgroundColor:
                      colorScheme === 'dark' ? COLORS.white : COLORS.primary,
                  },
                ]}
              />

              <View style={styles.subCardRightContent}>
                <View style={styles.subCardIconContainer}>
                  <Ionicons
                    name="cash-outline"
                    size={20}
                    style={[
                      styles.subCardIcon,
                      {
                        color:
                          colorScheme === 'dark'
                            ? COLORS.white
                            : COLORS.primary,
                      },
                    ]}
                  />
                </View>
                <View style={styles.subCardTextContainer}>
                  <Text
                    style={[
                      styles.subCardText,
                      {
                        color:
                          colorScheme === 'dark'
                            ? COLORS.white
                            : COLORS.primary,
                      },
                    ]}>
                    {tutorData?.tuitionFee}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.gradesContainer}>
              <View style={[styles.tutorSubContainer]}>
                <View
                  style={[
                    styles.tutorSubHeader,
                    {
                      backgroundColor:
                        colorScheme === 'dark'
                          ? COLORS.primary
                          : COLORS.primary,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.tutorSubHeaderText,
                      {
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.white,
                      },
                    ]}>
                    Grades
                  </Text>
                </View>
                <View style={styles.tutorSubCardContainer}>
                  <FlatList
                    data={selectedGrades}
                    keyExtractor={item => item}
                    renderItem={({item}) => (
                      <View
                        style={[
                          styles.tutorSubCard,
                          {
                            backgroundColor:
                              colorScheme === 'dark'
                                ? COLORS.white
                                : COLORS.white,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.tutorSubCardText,
                            {
                              color:
                                colorScheme === 'dark'
                                  ? COLORS.dark
                                  : COLORS.primary,
                            },
                          ]}>
                          {item}
                        </Text>
                      </View>
                    )}
                  />
                </View>
              </View>
            </View>

            <View style={styles.subjectsContainer}>
              <View style={[styles.tutorSubContainer]}>
                <View
                  style={[
                    styles.tutorSubHeader,
                    {
                      backgroundColor:
                        colorScheme === 'dark'
                          ? COLORS.primary
                          : COLORS.primary,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.tutorSubHeaderText,
                      {
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.white,
                      },
                    ]}>
                    Subjects
                  </Text>
                </View>
                <View style={styles.tutorSubCardContainer}>
                  <FlatList
                    data={selectedSubjects}
                    keyExtractor={item => item}
                    renderItem={({item}) => (
                      <View
                        style={[
                          styles.tutorSubCard,
                          {
                            backgroundColor:
                              colorScheme === 'dark'
                                ? COLORS.white
                                : COLORS.white,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.tutorSubCardText,
                            {
                              color:
                                colorScheme === 'dark'
                                  ? COLORS.dark
                                  : COLORS.primary,
                            },
                          ]}>
                          {item}
                        </Text>
                      </View>
                    )}
                  />
                </View>
              </View>
            </View>

            <View style={styles.tuitionDetailsContainer}>
              <View style={styles.detailsHeaderContainer}>
                <Text
                  style={[
                    styles.detailsHeaderTitle,
                    {
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                    },
                  ]}>
                  Tuition Details
                </Text>
              </View>
              <FlatList
                data={[
                  {
                    icon: 'globe-outline',
                    title: 'Tuition Language',
                    values: tutorData?.tuitionLanguage
                      ? Object.keys(tutorData.tuitionLanguage).filter(
                          key => tutorData.tuitionLanguage[key],
                        )
                      : [],
                  },
                  {
                    icon: 'school-outline',
                    title: 'Tuition Type',
                    values: tutorData?.tuitionType
                      ? Object.keys(tutorData.tuitionType).filter(
                          key => tutorData.tuitionType[key],
                        )
                      : [],
                  },
                  {
                    icon: 'book-outline',
                    title: 'Syllabus',
                    values: tutorData?.syllabusType
                      ? Object.keys(tutorData.syllabusType).filter(
                          key => tutorData.syllabusType[key],
                        )
                      : [],
                  },
                  {
                    icon: 'cash-outline',
                    title: 'Fee',
                    values: tutorData?.tuitionFee ? [tutorData.tuitionFee] : [],
                  },
                ]}
                keyExtractor={item => item.title}
                renderItem={({item}) => (
                  <View style={styles.tableRow}>
                    <View style={styles.headings}>
                      <Ionicons
                        name={item.icon}
                        size={20}
                        color={COLORS.primary}
                      />
                      <Text
                        style={[
                          styles.tableHeading,
                          {
                            color:
                              colorScheme === 'dark'
                                ? COLORS.white
                                : COLORS.dark,
                          },
                        ]}>
                        {item.title}:
                      </Text>
                    </View>
                    <View style={styles.tableValuesContainer}>
                      {item.values.map((value, index) => (
                        <Text
                          key={index}
                          style={[
                            styles.tableValue,
                            {
                              color:
                                colorScheme === 'dark'
                                  ? COLORS.white
                                  : COLORS.primary,
                            },
                          ]}>
                          {value}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
              />
            </View>

            <View style={styles.teacherDetailsContainer}>
              <View style={styles.detailsHeaderContainer}>
                <Text
                  style={[
                    styles.detailsHeaderTitle,
                    {
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                    },
                  ]}>
                  Teacher Details
                </Text>
              </View>
              <FlatList
                data={[
                  {
                    icon: 'person-outline',
                    title: 'Name',
                    values: tutorData?.fullName ? [tutorData.fullName] : [],
                  },
                  {
                    icon: 'male-outline',
                    title: 'Gender',
                    values: tutorData?.gender ? [tutorData.gender] : [],
                  },
                  {
                    icon: 'calendar-outline',
                    title: 'Age',
                    values: tutorData?.age ? [tutorData.age.toString()] : [],
                  },
                  {
                    icon: 'location-outline',
                    title: 'City',
                    values: tutorData?.city ? [tutorData.city] : [],
                  },
                  {
                    icon: 'call-outline',
                    title: 'Phone Number',
                    values: tutorData?.phone ? [tutorData.phone] : [],
                  },
                ]}
                keyExtractor={item => item.title}
                renderItem={({item}) => (
                  <View style={styles.tableRow}>
                    <View style={styles.headings}>
                      <Ionicons
                        name={item.icon}
                        size={20}
                        color={COLORS.primary}
                      />
                      <Text
                        style={[
                          styles.tableHeading,
                          {
                            color:
                              colorScheme === 'dark'
                                ? COLORS.white
                                : COLORS.dark,
                          },
                        ]}>
                        {item.title}:
                      </Text>
                    </View>
                    <View style={styles.tableValuesContainer}>
                      {item.values.map((value, index) => (
                        <Text
                          key={index}
                          style={[
                            styles.tableValue,
                            {
                              color:
                                colorScheme === 'dark'
                                  ? COLORS.white
                                  : COLORS.primary,
                            },
                          ]}>
                          {value}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
              />
            </View>

            <View style={styles.teacherQualificationsContainer}>
              <View style={styles.detailsHeaderContainer}>
                <Text
                  style={[
                    styles.detailsHeaderTitle,
                    {
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                    },
                  ]}>
                  Teacher Qualifications
                </Text>
              </View>
              <FlatList
                data={[
                  {
                    icon: 'school-outline',
                    title: 'Education',
                    values: tutorData?.education ? [tutorData.education] : [],
                  },
                  {
                    icon: 'briefcase-outline',
                    title: 'Experience',
                    values: tutorData?.teachingExperience
                      ? [tutorData.teachingExperience]
                      : [],
                  },
                ]}
                keyExtractor={item => item.title}
                renderItem={({item}) => (
                  <View style={styles.tableRow}>
                    <View style={styles.headings}>
                      <Ionicons
                        name={item.icon}
                        size={20}
                        color={COLORS.primary}
                      />
                      <Text
                        style={[
                          styles.tableHeading,
                          {
                            color:
                              colorScheme === 'dark'
                                ? COLORS.white
                                : COLORS.dark,
                          },
                        ]}>
                        {item.title}:
                      </Text>
                    </View>
                    <View style={styles.tableValuesContainer}>
                      {item.values.map((value, index) => (
                        <Text
                          key={index}
                          style={[
                            styles.tableValue,
                            {
                              color:
                                colorScheme === 'dark'
                                  ? COLORS.white
                                  : COLORS.primary,
                            },
                          ]}>
                          {value}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
              />
            </View>

            <View style={styles.ratingContainer}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#007bff',
                  padding: 10,
                  borderRadius: 5,
                  marginTop: 20,
                }}
                onPress={() => setRatingModalVisible(true)}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Rate this Tutor
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.contactOptionsContainer}>
            <TouchableOpacity
              onPress={tutorId => handleChatBox(tutorId)}
              style={[
                styles.contactButton,
                {
                  backgroundColor:
                    colorScheme === 'dark' ? COLORS.dark : COLORS.dark,
                },
              ]}>
              <Ionicons
                name="chatbubble-outline"
                size={22}
                color={colorScheme === 'dark' ? COLORS.primary : COLORS.primary}
              />
              <Text style={[styles.contactButtonText, {color: COLORS.primary}]}>
                Chat
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.contactButton,
                {
                  backgroundColor:
                    colorScheme === 'dark' ? COLORS.dark : COLORS.dark,
                },
              ]}
              onPress={() => {
                const phoneNumber = tutorData?.phone
                  ? `+${tutorData?.phone}`
                  : '';
                console.log('Opening WhatsApp with phone number:', phoneNumber);

                if (phoneNumber) {
                  Linking.openURL(`whatsapp://send?phone=${phoneNumber}`).catch(
                    err => console.error('Error opening WhatsApp: ', err),
                  );
                } else {
                  console.error('Invalid phone number');
                }
              }}>
              <Ionicons
                name="logo-whatsapp"
                size={22}
                color={colorScheme === 'dark' ? COLORS.primary : COLORS.primary}
              />
              <Text style={[styles.contactButtonText, {color: COLORS.primary}]}>
                WhatsApp
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.contactButton,
                {
                  backgroundColor:
                    colorScheme === 'dark' ? COLORS.dark : COLORS.dark,
                },
              ]}
              onPress={() => Linking.openURL(`tel:${tutorData?.phone}`)}>
              <Ionicons
                name="call-outline"
                size={22}
                color={colorScheme === 'dark' ? COLORS.primary : COLORS.primary}
              />
              <Text style={[styles.contactButtonText, {color: COLORS.primary}]}>
                Call
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <TutorRatingModal
        visible={ratingModalVisible}
        onClose={() => setRatingModalVisible(false)}
        tutorId={tutorId}
      />
    </SafeAreaView>
  );
};

export default SubjectTutorDetailedProfile;

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
    paddingHorizontal: width * 0.02,
    paddingVertical: width * 0.05,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gray,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContainer: {
    paddingTop: height * 0.025,
  },

  headerTextContainer: {
    marginTop: height * 0.12,
    marginLeft: width * 0.05,
  },

  headerTitleText: {
    fontSize: width * 0.07,
    color: COLORS.dark,
    fontFamily: FONTS.bold,
  },

  profileHeaderContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: height * 0.01,
  },

  profileLeftContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: width * 0.03,
  },

  imgContainer: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: (width * 0.25) / 2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    marginRight: width * 0.03,
  },

  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  name: {
    fontSize: width * 0.07,
    fontFamily: FONTS.semiBold,
  },

  subCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: height * 0.025,
    marginVertical: height * 0.022,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    width: width * 1,
  },

  subCardLeftContent: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: width * 0.03,
  },

  subCardRightContent: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: width * 0.03,
  },

  subCardTextContainer: {
    alignItems: 'center',
  },

  subCardText: {
    fontSize: width * 0.035,
    fontFamily: FONTS.semiBold,
  },

  verticalDivider: {
    width: 2,
    marginHorizontal: width * 0.03,
    height: '100%',
  },

  tutorSubContainer: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 15,
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.032,
    alignItems: 'center',
    marginVertical: height * 0.05,
    marginHorizontal: width * 0.05,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  tutorSubHeader: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.06,
    borderRadius: 8,
    alignItems: 'center',
    width: width * 0.5,
    marginTop: -height * 0.06,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  tutorSubHeaderText: {
    fontSize: width * 0.04,
    fontFamily: FONTS.semiBold,
    textAlign: 'center',
  },

  tutorSubCardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: width * 0.85,
    marginTop: height * 0.02,
    gap: height * 0.015,
  },

  tutorSubCard: {
    width: width * 0.32,
    height: height * 0.14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: height * 0.01,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    backgroundColor: '#fff',
  },

  tutorSubCardText: {
    fontSize: width * 0.042,
    fontFamily: FONTS.medium,
    textAlign: 'center',
  },

  detailsHeaderContainer: {
    marginLeft: width * 0.01,
  },

  detailsHeaderTitle: {
    fontSize: width * 0.06,
    color: COLORS.dark,
    fontFamily: FONTS.semiBold,
  },

  tuitionDetailsContainer: {
    marginVertical: height * 0.02,
    paddingHorizontal: width * 0.06,
  },

  teacherDetailsContainer: {
    marginVertical: height * 0.02,
    paddingHorizontal: width * 0.06,
  },

  teacherQualificationsContainer: {
    marginVertical: height * 0.02,
    paddingHorizontal: width * 0.06,
  },

  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: height * 0.01,
    marginTop: height * 0.02,
  },

  headings: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  tableHeading: {
    fontSize: width * 0.04,
    fontFamily: FONTS.semiBold,
    marginLeft: width * 0.02,
  },

  tableValuesContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },

  tableValue: {
    fontSize: width * 0.04,
    fontFamily: FONTS.semiBold,
    textTransform: 'capitalize',
  },

  ratingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
  },

  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: width * 0.05,
  },

  contactOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: height * 0.01,
  },

  contactButton: {
    alignItems: 'center',
    padding: height * 0.012,
    width: width * 0.3,
  },

  contactButtonText: {
    marginTop: height * 0.01,
    fontSize: width * 0.04,
    fontFamily: FONTS.bold,
  },
});
