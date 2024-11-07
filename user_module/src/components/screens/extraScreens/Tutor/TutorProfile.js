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
import {Picker} from '@react-native-picker/picker';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {COLORS, FONTS} from '../../../constants/Constants';
import imgPlaceHolder from '../../../../assets/placeholders/default-avatar.png';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomModal from '../../../utils/modals/CustomModal';
import ImageUploadModal from '../../../utils/modals/ImageUploadModal';

const {width, height} = Dimensions.get('window');

const TutorProfile = () => {
  const [photoURL, setPhotoUrl] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [education, setEducation] = useState('');
  const [tuitionLanguage, setTuitionLanguage] = useState({
    urdu: '',
    english: '',
  });

  const [tuitionType, setTuitionType] = useState({
    online: '',
    offline: '',
  });

  const [syllabusType, setSyllabusType] = useState({
    bise: '',
    cambridge: '',
  });

  const [boardRegions, setBoardRegions] = useState({
    federal: '',
    punjab: '',
    sindh: '',
    kpk: '',
    azadKashmir: '',
    balochistan: '',
  });

  const [tuitionGrades, setTuitionGrades] = useState({
    playGroup: '',
    primary: '',
    middle: '',
    high: '',
    intermediate: '',
    oLevel: '',
    aLevel: '',
    allGrades: '',
  });

  const [tuitionSubjects, setTuitionSubjects] = useState({
    math: '',
    science: '',
    holyQuran: '',
    physics: '',
    chemistry: '',
    biology: '',
    computerScience: '',
    english: '',
    allScienceSubjects: '',
    artSubjects: '',
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
          setEmail(userData.email);
          setPhone(userData.phoneNumber);
          setPhotoUrl(userData.profileImage);
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

  const handleSyllabusToggle = type => {
    setSyllabusType(prev => {
      const newState = {...prev, [type]: !prev[type]};

      if (type === 'cambridge') {
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
      const updated = {
        federal,
        punjab,
        sindh,
        kpk,
        azadKashmir,
        balochistan,
        [region]: true,
      };
      return updated;
    });
  };

  const handleTuitionGradesChange = grade => {
    setTuitionGrades(prev => {
      const updated = {...prev, [grade]: !prev[grade]};
      return {
        ...updated,
      };
    });
  };

  const handleTuitionSubjectsChange = subject => {
    setTuitionSubjects(prev => {
      const updated = {...prev, [subject]: !prev[subject]};
      return {
        ...updated,
      };
    });
  };

  const handleImagePress = () => {
    setShowImageUploadModal(true);
  };

  const handleImageUpload = url => {
    setShowImageUploadModal(false);
    setNewImageUrl(url);
  };

  const handleCreateTutorProfile = async () => {
    setLoading(true);
    setShowAuthModal(true);

    if (!city || !gender || !age || !education) {
      alert('Please fill in all the required fields.');
      setLoading(false);
      setShowAuthModal(false);
      return;
    }

    if (isNaN(age) || age < 18) {
      alert('Please enter a valid age (must be greater than 18).');
      setLoading(false);
      setShowAuthModal(false);
      return;
    }

    const tuitionFeeString = tuitionFee.trim();
    if (!tuitionFeeString || tuitionFeeString === '') {
      alert('Please enter a valid tuition fee.');
      setLoading(false);
      setShowAuthModal(false);
      return;
    }

    if (!tuitionLanguage.urdu && !tuitionLanguage.english) {
      alert('Please select at least one tuition language (Urdu or English).');
      setLoading(false);
      setShowAuthModal(false);
      return;
    }

    if (!tuitionType.online && !tuitionType.offline) {
      alert('Please select at least one tuition type (Online or Offline).');
      setLoading(false);
      setShowAuthModal(false);
      return;
    }

    if (!syllabusType.bise && !syllabusType.cambridge) {
      alert('Please select at least one syllabus type (Bise or Cambridge).');
      setLoading(false);
      setShowAuthModal(false);
      return;
    }

    if (
      !boardRegions.federal &&
      !boardRegions.punjab &&
      !boardRegions.sindh &&
      !boardRegions.kpk &&
      !boardRegions.azadKashmir &&
      !boardRegions.balochistan
    ) {
      alert('Please select at least one board region.');
      setLoading(false);
      setShowAuthModal(false);
      return;
    }

    if (
      !tuitionGrades.playGroup &&
      !tuitionGrades.primary &&
      !tuitionGrades.middle &&
      !tuitionGrades.high &&
      !tuitionGrades.intermediate &&
      !tuitionGrades.oLevel &&
      !tuitionGrades.aLevel &&
      !tuitionGrades.allGrades
    ) {
      alert('Please select at least one tuition grade.');
      setLoading(false);
      setShowAuthModal(false);
      return;
    }

    if (
      !tuitionSubjects.math &&
      !tuitionSubjects.science &&
      !tuitionSubjects.holyQuran &&
      !tuitionSubjects.physics &&
      !tuitionSubjects.chemistry &&
      !tuitionSubjects.biology &&
      !tuitionSubjects.computerScience &&
      !tuitionSubjects.english &&
      !tuitionSubjects.allScienceSubjects &&
      !tuitionSubjects.artSubjects
    ) {
      alert('Please select at least one tuition subject.');
      setLoading(false);
      setShowAuthModal(false);
      return;
    }

    try {
      const user = auth().currentUser;
      const userId = user.uid;

      const tutorProfile = {
        userId: userId,
        profileImage: photoURL || '',
        fullName: fullName || '',
        email: email || '',
        phone: phone || '',
        city: city || '',
        gender: gender || '',
        age: age || '',
        education: education || '',
        tuitionLanguage: {
          ...(tuitionLanguage.urdu && {urdu: tuitionLanguage.urdu}),
          ...(tuitionLanguage.english && {english: tuitionLanguage.english}),
        },
        tuitionType: {
          ...(tuitionType.online && {online: tuitionType.online}),
          ...(tuitionType.offline && {offline: tuitionType.offline}),
        },
        syllabusType: {
          ...(syllabusType.bise && {bise: syllabusType.bise}),
          ...(syllabusType.cambridge && {cambridge: syllabusType.cambridge}),
        },
        boardRegions: {
          ...(boardRegions.federal && {federal: boardRegions.federal}),
          ...(boardRegions.punjab && {punjab: boardRegions.punjab}),
          ...(boardRegions.sindh && {sindh: boardRegions.sindh}),
          ...(boardRegions.kpk && {kpk: boardRegions.kpk}),
          ...(boardRegions.azadKashmir && {
            azadKashmir: boardRegions.azadKashmir,
          }),
          ...(boardRegions.balochistan && {
            balochistan: boardRegions.balochistan,
          }),
        },
        tuitionGrades: {
          ...(tuitionGrades.playGroup && {playGroup: tuitionGrades.playGroup}),
          ...(tuitionGrades.primary && {primary: tuitionGrades.primary}),
          ...(tuitionGrades.middle && {middle: tuitionGrades.middle}),
          ...(tuitionGrades.high && {high: tuitionGrades.high}),
          ...(tuitionGrades.intermediate && {
            intermediate: tuitionGrades.intermediate,
          }),
          ...(tuitionGrades.oLevel && {oLevel: tuitionGrades.oLevel}),
          ...(tuitionGrades.aLevel && {aLevel: tuitionGrades.aLevel}),
          ...(tuitionGrades.allGrades && {allGrades: tuitionGrades.allGrades}),
        },
        tuitionSubjects: {
          ...(tuitionSubjects.math && {math: tuitionSubjects.math}),
          ...(tuitionSubjects.science && {science: tuitionSubjects.science}),
          ...(tuitionSubjects.holyQuran && {
            holyQuran: tuitionSubjects.holyQuran,
          }),
          ...(tuitionSubjects.physics && {physics: tuitionSubjects.physics}),
          ...(tuitionSubjects.chemistry && {
            chemistry: tuitionSubjects.chemistry,
          }),
          ...(tuitionSubjects.biology && {biology: tuitionSubjects.biology}),
          ...(tuitionSubjects.computerScience && {
            computerScience: tuitionSubjects.computerScience,
          }),
          ...(tuitionSubjects.english && {english: tuitionSubjects.english}),
          ...(tuitionSubjects.allScienceSubjects && {
            allScienceSubjects: tuitionSubjects.allScienceSubjects,
          }),
          ...(tuitionSubjects.artSubjects && {
            artSubjects: tuitionSubjects.artSubjects,
          }),
        },
        tuitionFee: tuitionFeeString || '',
        teachingExperience: teachingExperience || '',
        createdAt: Date.now(),
      };

      const docRef = await firebase
        .firestore()
        .collection('tutor_profile')
        .add(tutorProfile);

      await docRef.update({
        tutorId: docRef.id,
      });

      setCity('');
      setGender('');
      setAge('');
      setEducation('');
      setTuitionLanguage('');
      setTuitionType('');
      setSyllabusType('');
      setBoardRegions('');
      setTuitionGrades('');
      setTuitionSubjects('');
      setTuitionFee('');
      setTeachingExperience('');

      setShowAuthModal(false);
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.replace('Profile');
      }, 3000);
    } catch (error) {
      setShowAuthModal(false);
      console.error('Error creating tutor profile: ', error);

      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
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
          Create Your Profile!
        </Text>
        <Text
          style={[
            styles.headerDescriptionText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          You can create your tutor profile here.
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
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.imgContainer}
              onPress={handleImagePress}>
              {newImageURL || photoURL ? (
                <Image
                  source={{uri: newImageURL || photoURL}}
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
                    value={fullName || ''}
                    onChangeText={e => setFullName(e)}
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
                    value={email || ''}
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
                    value={phone || ''}
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
                    value={city || ''}
                    onChangeText={e => setCity(e)}
                  />
                </View>

                <View style={styles.pickerContainer}>
                  <Ionicons
                    name="male"
                    size={25}
                    color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
                    style={styles.icon}
                  />
                  <Picker
                    Value={gender}
                    style={[
                      styles.picker,
                      {
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      },
                    ]}
                    onValueChange={e => setGender(e)}>
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
                    value={age || ''}
                    onChangeText={e => setAge(e)}
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
                    value={education || ''}
                    onChangeText={e => setEducation(e)}
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
                    {renderCheckbox('Urdu', tuitionLanguage.urdu, () => {
                      setTuitionLanguage(prev => ({
                        ...prev,
                        urdu: !prev.urdu,
                      }));
                    })}
                    {renderCheckbox('English', tuitionLanguage.english, () => {
                      setTuitionLanguage(prev => ({
                        ...prev,
                        english: !prev.english,
                      }));
                    })}
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
                    {renderCheckbox('Online', tuitionType.online, () => {
                      setTuitionType(prev => ({
                        ...prev,
                        online: !prev.online,
                      }));
                    })}
                    {renderCheckbox('Offline', tuitionType.offline, () => {
                      setTuitionType(prev => ({
                        ...prev,
                        offline: !prev.offline,
                      }));
                    })}
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
                    {renderCheckbox('Bise', syllabusType.bise, () =>
                      handleSyllabusToggle('bise'),
                    )}
                    {renderCheckbox('Cambridge', syllabusType.cambridge, () =>
                      handleSyllabusToggle('cambridge'),
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
                              colorScheme === 'dark'
                                ? COLORS.white
                                : COLORS.dark,
                          },
                        ]}>
                        Select Regions of BISE Boards *
                      </Text>
                    </View>

                    <View style={styles.subOptionsContainer}>
                      <View style={styles.row}>
                        {renderCheckbox('Federal', boardRegions.federal, () =>
                          handleBoardRegionChange('federal'),
                        )}
                        {renderCheckbox('Punjab', boardRegions.punjab, () =>
                          handleBoardRegionChange('punjab'),
                        )}
                        {renderCheckbox('Sindh', boardRegions.sindh, () =>
                          handleBoardRegionChange('sindh'),
                        )}
                      </View>

                      <View style={styles.row}>
                        {renderCheckbox('KPK', boardRegions.kpk, () =>
                          handleBoardRegionChange('kpk'),
                        )}
                        {renderCheckbox(
                          'Azad Kashmir',
                          boardRegions.azadKashmir,
                          () => handleBoardRegionChange('azadKashmir'),
                        )}
                        {renderCheckbox(
                          'Balochistan',
                          boardRegions.balochistan,
                          () => handleBoardRegionChange('balochistan'),
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
                      {renderCheckbox(
                        'PlayGroup',
                        tuitionGrades.playGroup,
                        () => handleTuitionGradesChange('playGroup'),
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

                      {renderCheckbox(
                        'High(9th-10th)',
                        tuitionGrades.high,
                        () => handleTuitionGradesChange('high'),
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
                      {renderCheckbox(
                        'All Grades',
                        tuitionGrades.allGrades,
                        () => handleTuitionGradesChange('allGrades'),
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
                      color={
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark
                      }
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
                      value={tuitionFee || ''}
                      onChangeText={setTuitionFee}
                    />
                  </View>
                </View>

                <View style={styles.tuitionSubCategories}>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="school-outline"
                      size={20}
                      color={
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark
                      }
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
                      placeholder="Teaching Experience *"
                      placeholderTextColor={
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark
                      }
                      value={teachingExperience || ''}
                      onChangeText={setTeachingExperience}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={[styles.createProfileBtn]}
                onPress={handleCreateTutorProfile}>
                <Text style={styles.createProfileText}>
                  {loading ? (
                    <ActivityIndicator color={COLORS.white} size={25} />
                  ) : (
                    'Create Profile'
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}

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
