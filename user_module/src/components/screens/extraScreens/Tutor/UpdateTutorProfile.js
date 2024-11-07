import React, {useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  useColorScheme,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {COLORS, FONTS} from '../../../constants/Constants';
import {Picker} from '@react-native-picker/picker';
import imgPlaceHolder from '../../../../assets/placeholders/default-avatar.png';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomModal from '../../../utils/modals/CustomModal';
import ImageUploadModal from '../../../utils/modals/ImageUploadModal';

const {width, height} = Dimensions.get('window');

const TutorProfile = () => {
  const [profileData, setProfileData] = useState('');
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');
  const [tuitionLanguage, setTuitionLanguage] = useState({
    urdu: false,
    english: false,
  });
  const [tuitionType, setTuitionType] = useState({
    online: false,
    offline: false,
  });
  const [syllabusType, setSyllabusType] = useState({
    bise: false,
    cambridge: false,
  });

  const [boardRegions, setBoardRegions] = useState({
    federal: false,
    punjab: false,
    sindh: false,
    kpk: false,
    azadKashmir: false,
    balochistan: false,
  });

  const [tuitionGrades, setTuitionGrades] = useState({
    playGroup: false,
    primary: false,
    middle: false,
    high: false,
    intermediate: false,
    oLevel: false,
    aLevel: false,
    allGrades: false,
  });

  const [tuitionSubjects, setTuitionSubjects] = useState({
    math: false,
    science: false,
    holyQuran: false,
    physics: false,
    chemistry: false,
    biology: false,
    computerScience: false,
    english: false,
    allScienceSubjects: false,
    artSubjects: false,
  });

  const [tuitionFee, setTuitionFee] = useState('');
  const [teachingExperience, setTeachingExperience] = useState('');

  const [showBoardRegions, setShowBoardRegions] = useState(true);
  const [newImageURL, setNewImageUrl] = useState('');
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const fetchTutorProfile = async userId => {
    const tutorQuerySnapshot = await firestore()
      .collection('tutor_profile')
      .where('userId', '==', userId)
      .get();
    if (!tutorQuerySnapshot.empty) {
      const tutorDoc = tutorQuerySnapshot.docs[0];
      return {id: tutorDoc.id, ...tutorDoc.data()};
    }
    return {};
  };

  const fetchData = async () => {
    const user = auth().currentUser;
    if (user) {
      try {
        setLoading(true);
        const tutorData = await fetchTutorProfile(user.uid);
        setProfileData(tutorData);

        setTuitionLanguage(tutorData.tuitionLanguage || '');

        setTuitionType(tutorData.tuitionType || '');

        setSyllabusType(tutorData.syllabusType || '');

        setBoardRegions(tutorData.boardRegions || '');

        setTuitionGrades(tutorData.tuitionGrades || '');

        setTuitionSubjects(tutorData.tuitionSubjects || '');

        setTuitionFee(tutorData.tuitionFee || '');

        setTeachingExperience(tutorData.teachingExperience || '');

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }
  };

  const handleImagePress = () => {
    setShowImageUploadModal(true);
  };

  const handleImageUpload = url => {
    setShowImageUploadModal(false);
    setNewImageUrl(url);
  };

  const handleInputChange = (field, value) => {
    setProfileData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleTuitionLanguageChange = field => {
    setTuitionLanguage(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleTuitionTypeChange = field => {
    setTuitionType(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSyllabusToggle = type => {
    setSyllabusType(prev => {
      const newState = {...prev, [type]: !prev[type]};

      if (newState.cambridge) {
        setShowBoardRegions(false);
      } else {
        setShowBoardRegions(true);
      }

      if (!newState.bise && !newState.cambridge) {
        setShowBoardRegions(false);
      }

      return newState;
    });
  };

  const handleBoardRegionChange = region => {
    setBoardRegions(prev => {
      if (prev[region] === true) return prev;

      return {
        federal: false,
        punjab: false,
        sindh: false,
        kpk: false,
        azadKashmir: false,
        balochistan: false,
        [region]: true,
      };
    });
  };

  const handleTuitionGradesChange = grade => {
    setTuitionGrades(prev => ({
      ...prev,
      [grade]: !prev[grade],
    }));
  };

  const handleTuitionSubjectsChange = subject => {
    setTuitionGrades(prev => ({
      ...prev,
      [subject]: !prev[subject],
    }));
  };

  const renderCheckbox = (label, isSelected, onPress) => (
    <View style={styles.optionRow}>
      <TouchableOpacity onPress={onPress} style={styles.checkboxContainer}>
        <View style={styles.checkbox}>
          {isSelected && <Text style={styles.checkmark}>&#10003;</Text>}
        </View>
      </TouchableOpacity>
      <View style={styles.optionTextContainer}>
        <Text
          style={[
            styles.optionText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          {label}
        </Text>
      </View>
    </View>
  );

  const handleUpdateProfile = async () => {
    const user = auth().currentUser;
    if (user && profileData.id) {
      try {
        setLoading(true);
        await firestore()
          .collection('tutor_profile')
          .doc(profileData.id)
          .update({
            profileImage: newImageURL || profileData.profileImage,
            fullName: fullName || profileData.fullName,
            city: city || profileData.city,
            gender: gender || profileData.gender,
            tuitionLanguage: tuitionLanguage || profileData.tuitionLanguage,
            tuitionType: tuitionType || profileData.tuitionType,
            syllabusType: syllabusType || profileData.syllabusType,
            boardRegions: boardRegions || profileData.boardRegions,
            tuitionGrades: tuitionGrades || profileData.tuitionGrades,
            tuitionSubjects: tuitionSubjects || profileData.tuitionSubjects,
            tuitionFee: tuitionFee || profileData.tuitionFee,
            teachingExperience:
              teachingExperience || profileData.teachingExperience,
          });
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
      } catch (error) {
        console.error('Error creating tutor profile: ', error);

        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 3000);
      } finally {
        setLoading(false);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
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
          Update Your Profile!
        </Text>
        <Text
          style={[
            styles.headerDescriptionText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          You can update your tutor profile here.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.imgContainer}
            onPress={handleImagePress}>
            {newImageURL || profileData?.profileImage ? (
              <Image
                source={{uri: newImageURL || profileData?.profileImage}}
                style={styles.image}
              />
            ) : (
              <Image source={imgPlaceHolder} style={styles.image} />
            )}
          </TouchableOpacity>

          <View style={styles.personalDetailsContainer}>
            <View style={styles.headingLabelContainer}>
              <Text
                style={{
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                  fontSize: width * 0.04,
                  left: width * 0.05,
                  fontFamily: FONTS.medium,
                  marginBottom: height * 0.02,
                }}>
                Personal Details (Required)*
              </Text>
            </View>

            <View style={styles.inputFieldContainer}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.inputField,
                    {
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                    },
                  ]}
                  placeholder="Full Name *"
                  placeholderTextColor={
                    colorScheme === 'dark' ? COLORS.white : COLORS.dark
                  }
                  value={profileData?.fullName || ''}
                  onChangeText={e => handleInputChange('fullName', e)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.inputField,
                    {
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                    },
                  ]}
                  placeholder="Email *"
                  placeholderTextColor={
                    colorScheme === 'dark' ? COLORS.white : COLORS.dark
                  }
                  value={profileData?.email || ''}
                  editable={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.inputField,
                    {
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                    },
                  ]}
                  keyboardType="phone-pad"
                  placeholder="Phone Number *"
                  placeholderTextColor={
                    colorScheme === 'dark' ? COLORS.white : COLORS.dark
                  }
                  value={profileData?.phone || ''}
                  editable={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="home-outline"
                  size={20}
                  color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.inputField,
                    {
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                    },
                  ]}
                  placeholder="City *"
                  placeholderTextColor={
                    colorScheme === 'dark' ? COLORS.white : COLORS.dark
                  }
                  value={profileData?.city || ''}
                  onChangeText={e => handleInputChange('city', e)}
                />
              </View>

              <View style={styles.pickerContainer}>
                <Ionicons
                  name="male-outline"
                  size={25}
                  color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
                  style={styles.icon}
                />
                <Picker
                  selectedValue={profileData?.gender}
                  style={[
                    styles.picker,
                    {
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                    },
                  ]}
                  onValueChange={e => handleInputChange('gender', e)}>
                  <Picker.Item label="Select Gender *" value="" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                </Picker>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.inputField,
                    {
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                    },
                  ]}
                  placeholder="Age *"
                  placeholderTextColor={
                    colorScheme === 'dark' ? COLORS.white : COLORS.dark
                  }
                  value={profileData?.age || ''}
                  editable={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="school-outline"
                  size={20}
                  color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.inputField,
                    {
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                    },
                  ]}
                  placeholder="Highest Education *"
                  placeholderTextColor={
                    colorScheme === 'dark' ? COLORS.white : COLORS.dark
                  }
                  value={profileData?.education || ''}
                  editable={false}
                />
              </View>
            </View>
          </View>

          <View style={styles.tuitionDetailsContainer}>
            <View style={styles.headingLabelContainer}>
              <Text
                style={{
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                  fontSize: width * 0.04,
                  left: width * 0.05,
                  fontFamily: FONTS.medium,
                  marginBottom: height * 0.02,
                }}>
                Tuition Details (Required)*
              </Text>
            </View>

            <View style={styles.tuitionSubDetailsContainer}>
              <View style={styles.tuitionSubCategories}>
                <View style={styles.subDetailTitleContainer}>
                  <Text
                    style={[
                      styles.subDetailTitleText,
                      {
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      },
                    ]}>
                    Tuition Language *
                  </Text>
                </View>

                <View style={styles.subOptionsContainer}>
                  {renderCheckbox('Urdu', tuitionLanguage?.urdu, () =>
                    handleTuitionLanguageChange('urdu'),
                  )}

                  {renderCheckbox('English', tuitionLanguage?.english, () =>
                    handleTuitionLanguageChange('english'),
                  )}
                </View>
              </View>

              <View style={styles.tuitionSubCategories}>
                <View style={styles.subDetailTitleContainer}>
                  <Text
                    style={[
                      styles.subDetailTitleText,
                      {
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      },
                    ]}>
                    Tuition Type *
                  </Text>
                </View>

                <View style={styles.subOptionsContainer}>
                  {renderCheckbox('Online', tuitionType?.online, () =>
                    handleTuitionTypeChange('online'),
                  )}

                  {renderCheckbox('Offline', tuitionType?.offline, () =>
                    handleTuitionTypeChange('offline'),
                  )}
                </View>
              </View>

              <View style={styles.tuitionSubCategories}>
                <View style={styles.subDetailTitleContainer}>
                  <Text
                    style={[
                      styles.subDetailTitleText,
                      {
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      },
                    ]}>
                    Syllabus Type *
                  </Text>
                </View>

                <View style={styles.subOptionsContainer}>
                  {renderCheckbox(
                    'Bise',
                    syllabusType?.bise,
                    () => handleSyllabusToggle('bise'),
                    syllabusType?.bise,
                  )}
                  {renderCheckbox(
                    'Cambridge',
                    syllabusType?.cambridge,
                    () => handleSyllabusToggle('cambridge'),
                    syllabusType?.cambridge,
                  )}
                </View>
              </View>

              {showBoardRegions && (
                <View style={styles.tuitionSubCategories}>
                  <View style={styles.subDetailTitleContainer}>
                    <Text
                      style={[
                        styles.subDetailTitleText,
                        {
                          color:
                            colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                        },
                      ]}>
                      Select Regions of BISE Boards *
                    </Text>
                  </View>

                  <View style={styles.subOptionsContainer}>
                    <View style={styles.row}>
                      {['Federal', 'Punjab', 'Sindh'].map(region =>
                        renderCheckbox(
                          region,
                          boardRegions[region.toLowerCase()],
                          () => handleBoardRegionChange(region.toLowerCase()),
                        ),
                      )}
                    </View>

                    <View style={styles.row}>
                      {['KPK', 'Azad Kashmir', 'Balochistan'].map(region =>
                        renderCheckbox(
                          region,
                          boardRegions[region.toLowerCase()],
                          () => handleBoardRegionChange(region.toLowerCase()),
                        ),
                      )}
                    </View>
                  </View>
                </View>
              )}

              <View style={styles.tuitionSubCategories}>
                <View style={styles.subDetailTitleContainer}>
                  <Text
                    style={[
                      styles.subDetailTitleText,
                      {
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      },
                    ]}>
                    Select Tuition Grades *
                  </Text>
                </View>

                <View style={styles.subOptionsContainer}>
                  <View style={styles.row}>
                    {renderCheckbox('PlayGroup', tuitionGrades.playGroup, () =>
                      handleTuitionGradesChange('playGroup'),
                    )}

                    {renderCheckbox(
                      'Primary(1st-5th)',
                      tuitionGrades.primary,
                      () => handleTuitionGradesChange('primary'),
                    )}

                    {renderCheckbox(
                      'Middle(6th-8th)',
                      tuitionGrades.middle,
                      () => handleTuitionGradesChange('middle'),
                    )}

                    {renderCheckbox('High(9th-10th)', tuitionGrades.high, () =>
                      handleTuitionGradesChange('high'),
                    )}
                  </View>

                  <View style={styles.row}>
                    {renderCheckbox(
                      'Inter(11th-12th)',
                      tuitionGrades.intermediate,
                      () => handleTuitionGradesChange('intermediate'),
                    )}

                    {renderCheckbox('O-Level', tuitionGrades.oLevel, () =>
                      handleTuitionGradesChange('oLevel'),
                    )}

                    {renderCheckbox('A-Level', tuitionGrades.aLevel, () =>
                      handleTuitionGradesChange('aLevel'),
                    )}

                    {renderCheckbox('All Grades', tuitionGrades.allGrades, () =>
                      handleTuitionGradesChange('allGrades'),
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.tuitionSubCategories}>
                <View style={styles.subDetailTitleContainer}>
                  <Text
                    style={[
                      styles.subDetailTitleText,
                      {
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      },
                    ]}>
                    Select Tuition Subjects *
                  </Text>
                </View>

                <View style={styles.subOptionsContainer}>
                  <View style={styles.row}>
                    {renderCheckbox('Maths', tuitionSubjects.math, () =>
                      handleTuitionSubjectsChange('math'),
                    )}

                    {renderCheckbox('Science', tuitionSubjects.science, () =>
                      handleTuitionSubjectsChange('science'),
                    )}

                    {renderCheckbox('Quran', tuitionSubjects.holyQuran, () =>
                      handleTuitionSubjectsChange('holyQuran'),
                    )}

                    {renderCheckbox('Physics', tuitionSubjects.physics, () =>
                      handleTuitionSubjectsChange('physics'),
                    )}
                  </View>

                  <View style={styles.row}>
                    {renderCheckbox(
                      'Chemistry',
                      tuitionSubjects.chemistry,
                      () => handleTuitionSubjectsChange('chemistry'),
                    )}

                    {renderCheckbox('Biology', tuitionSubjects.biology, () =>
                      handleTuitionSubjectsChange('biology'),
                    )}

                    {renderCheckbox(
                      'Computer',
                      tuitionSubjects.computerScience,
                      () => handleTuitionSubjectsChange('computerScience'),
                    )}

                    {renderCheckbox('English', tuitionSubjects.english, () =>
                      handleTuitionSubjectsChange('english'),
                    )}
                  </View>

                  <View style={styles.row}>
                    {renderCheckbox(
                      'All Subjects',
                      tuitionSubjects.allScienceSubjects,
                      () => handleTuitionSubjectsChange('allScienceSubjects'),
                    )}

                    {renderCheckbox('Arts', tuitionSubjects.artSubjects, () =>
                      handleTuitionSubjectsChange('artSubjects'),
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.tuitionSubCategories}>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="cash-outline"
                    size={20}
                    color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      styles.inputField,
                      {
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      },
                    ]}
                    placeholder="Tuition Fee *"
                    placeholderTextColor={
                      colorScheme === 'dark' ? COLORS.white : COLORS.dark
                    }
                    value={profileData?.tuitionFee || ''}
                    onChangeText={e => handleInputChange('tuitionFee', e)}
                  />
                </View>
              </View>

              <View style={styles.tuitionSubCategories}>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="school-outline"
                    size={20}
                    color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      styles.inputField,
                      {
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      },
                    ]}
                    placeholder="Teaching Experience *"
                    placeholderTextColor={
                      colorScheme === 'dark' ? COLORS.white : COLORS.dark
                    }
                    value={profileData?.teachingExperience || ''}
                    onChangeText={e =>
                      handleInputChange('teachingExperience', e)
                    }
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={[styles.createProfileBtn]}
              onPress={handleUpdateProfile}>
              <Text style={styles.createProfileText}>
                {loading ? (
                  <ActivityIndicator color={COLORS.white} size={25} />
                ) : (
                  'Update Profile'
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <ImageUploadModal
        visible={showImageUploadModal}
        onClose={() => setShowImageUploadModal(false)}
        onImageUpload={handleImageUpload}
        title="Upload Image!"
        description="Please Choose Your Profile Picture To Upload."
      />

      <CustomModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        animationSource={require('../../../../assets/animations/email.json')}
        title="Working!"
        description="Please Wait While Creating Your Tutor Profile."
      />

      <CustomModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        animationSource={require('../../../../assets/animations/success.json')}
        title="Success!"
        description="Profile created successfully!"
      />

      <CustomModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        animationSource={require('../../../../assets/animations/error.json')}
        title="Failure!"
        description="There was an error creating your profile!"
      />
    </SafeAreaView>
  );
};

export default TutorProfile;

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

  headerDescriptionText: {
    color: COLORS.dark,
    fontSize: width * 0.04,
    fontFamily: FONTS.medium,
    left: width * 0.01,
  },

  cardContainer: {
    paddingVertical: height * 0.01,
  },

  imgContainer: {
    marginBottom: height * 0.05,
    alignItems: 'center',
  },

  image: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: (width * 0.3) / 2,
    resizeMode: 'cover',
  },

  personalDetailsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    margin: height * 0.015,
  },

  tuitionDetailsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    margin: height * 0.015,
  },

  inputFieldContainer: {
    alignItems: 'center',
    marginVertical: height * 0.02,
    gap: height * 0.04,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: COLORS.primary,
    paddingHorizontal: width * 0.03,
    width: width * 0.95,
    height: height * 0.07,
  },

  inputIcon: {
    marginRight: width * 0.01,
  },

  inputField: {
    flex: 1,
    fontSize: width * 0.045,
    fontFamily: FONTS.regular,
    textTransform: 'capitalize',
  },

  pickerContainer: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: COLORS.primary,
    height: height * 0.07,
    width: width * 0.95,
    color: COLORS.dark,
    flexDirection: 'row',
    alignItems: 'center',
  },

  picker: {
    height: height * 0.06,
    width: width * 0.9,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
  },

  tuitionSubDetailsContainer: {
    marginVertical: height * 0.02,
  },

  subDetailTitleContainer: {
    marginBottom: height * 0.015,
  },

  subDetailTitleText: {
    fontSize: width * 0.045,
    fontFamily: FONTS.semiBold,
    left: width * 0.06,
  },

  tuitionSubCategories: {
    marginBottom: height * 0.04,
  },

  subOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkboxContainer: {
    marginRight: width * 0.02,
    marginTop: height * 0.01,
  },

  checkbox: {
    height: height * 0.036,
    width: width * 0.065,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkmark: {
    color: COLORS.primary,
  },

  optionTextContainer: {
    justifyContent: 'center',
  },

  optionText: {
    fontSize: width * 0.04,
    fontFamily: FONTS.semiBold,
  },

  btnContainer: {
    marginBottom: height * 0.02,
    width: width * 0.95,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: height * 0.02,
  },

  createProfileBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: width * 0.95,
    paddingVertical: height * 0.02,
  },

  createProfileText: {
    fontSize: width * 0.045,
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
  },
});
