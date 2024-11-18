import React, {useState, useCallback} from 'react';
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
  ActivityIndicator,
  FlatList,
} from 'react-native';

import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {COLORS, FONTS} from '../../constants/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import imgPlaceHolder from '../../../assets/placeholders/default-avatar.png';

const {width, height} = Dimensions.get('window');

const SubjectTutorProfile = () => {
  const route = useRoute();
  const {subjectName, tutorId} = route.params;
  const [tutors, setTutors] = useState([]);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);

  const subjectFieldMap = {
    Maths: 'math',
    Computer: 'computerScience',
    Biology: 'biology',
    Chemistry: 'chemistry',
    Physics: 'physics',
    English: 'english',
    'Holy Quran': 'quran',
  };

  const firestoreSubjectField = subjectFieldMap[subjectName];

  const fetchTutorsBySubject = async () => {
    try {
      if (!firestoreSubjectField) {
        console.error(`Invalid subject name: ${subjectName}`);
        return;
      }

      setLoading(true);
      const tutorsSnapshot = await firestore()
        .collection('tutor_profile')
        .where(`tuitionSubjects.${firestoreSubjectField}`, '==', true)
        .get();

      const tutorsList = tutorsSnapshot.docs.map(doc => ({
        tutorId: doc.id,
        ...doc.data(),
      }));

      setTutors(tutorsList);
    } catch (error) {
      console.error('Error fetching tutors:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchTutorsBySubject();
    }, [subjectName]),
  );

  const renderTutorProfile = ({item}) => (
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
  );

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
        <TouchableOpacity onPress={() => navigation.goBack()}>
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
          {subjectName} Tutors
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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <FlatList
            data={tutors}
            renderItem={renderTutorProfile}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.profileList}
            ListEmptyComponent={
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
                  No Tutor Available!
                </Text>
              </View>
            }
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default SubjectTutorProfile;

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
    fontSize: width * 0.08,
    color: COLORS.dark,
    fontFamily: FONTS.bold,
  },

  profileList: {
    padding: width * 0.01,
    gap: width * 0.15,
    flexGrow: 1,
  },

  tutorCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.1,
    marginLeft: width * 0.01,
  },

  tutorImage: {
    width: width * 0.25,
    height: height * 0.15,
    marginLeft: width * 0.02,
  },

  tutorName: {
    fontSize: width * 0.05,
    fontFamily: FONTS.bold,
    marginBottom: height * 0.02,
    left: width * 0.016,
  },

  tutorDetailContainer: {
    marginLeft: width * 0.01,
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

  tutorSubText: {
    fontSize: width * 0.04,
    fontFamily: FONTS.semiBold,
    textTransform: 'capitalize',
  },

  noTutorProfileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.75,
  },

  noTutorProfileText: {
    fontSize: width * 0.05,
    fontFamily: FONTS.semiBold,
    textAlign: 'center',
  },
});
