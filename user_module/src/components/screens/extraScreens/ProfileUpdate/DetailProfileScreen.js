import React, {useState, useEffect} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS} from '../../../constants/Constants';
import imgPlaceHolder from '../../../../assets/placeholders/default-avatar.png';
import CustomModal from '../../../utils/modals/CustomModal';
import ImageUploadModal from '../../../utils/modals/ImageUploadModal';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const {width, height} = Dimensions.get('window');

const DetailProfileScreen = () => {
  const [photoURL, setPhotoURL] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const navigation = useNavigation();
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [showNameUpdateModal, setShowNameUpdateModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const colorScheme = useColorScheme();
  const [newImageURL, setNewImageURL] = useState(null);
  const [isEdited, setIsEdited] = useState(false);

  const [fullNameError, setFullNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');

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
          setPhone(userData.phoneNumber);
          setAddress(userData.address);
          setPhotoURL(userData.profileImage);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUserData()]);
      setLoading(false);
    };

    loadData();
  }, [authInstance]);

  const handleFullNameChange = value => {
    setFullName(value);
    if (value === '') {
      setFullNameError('Full name is required');
    } else if (!/^[a-zA-Z\s]+$/.test(value)) {
      setFullNameError('Only alphabets are allowed');
    } else {
      setFullNameError('');
    }
  };

  const handlePhoneChange = value => {
    setPhone(value);
    if (value === '') {
      setPhoneError('Phone number is required');
    } else if (!/^(\+92|92|0)(3\d{2}|\d{2})(\d{7})$/.test(value)) {
      setPhoneError('Invalid phone number format');
    } else {
      setPhoneError('');
    }
  };

  const handleAddressChange = value => {
    setAddress(value);
    if (value === '') {
      setAddressError('Address is required');
    } else if (
      !/^House#\d+\sStreet#\d+\s[A-Za-z\s]+\s[A-Za-z\s]+$/.test(value)
    ) {
      setAddressError('Address must follow format');
    } else {
      setAddressError('');
    }
  };

  const handleImagePress = () => {
    setShowImageUploadModal(true);
  };

  const handleImageUpload = url => {
    setShowImageUploadModal(false);
    setNewImageURL(url);
    setIsEdited(true);
  };

  const handleFieldChange = () => {
    setIsEdited(true);
  };

  const isUpdateEnabled = () => {
    return isEdited;
  };

  const handleUpdateProfile = async () => {
    const user = auth().currentUser;
    setButtonLoading(true);

    try {
      let updatedProfile = {};

      if (fullName) {
        updatedProfile.displayName = fullName;
      }

      if (newImageURL) {
        updatedProfile.photoURL = newImageURL;
      }

      if (Object.keys(updatedProfile).length > 0) {
        await user.updateProfile(updatedProfile);
      }

      let updateData = {};

      if (fullName) {
        updateData.fullName = fullName;
      }

      if (phone) {
        updateData.phoneNumber = phone;
      }

      if (address) {
        updateData.address = address;
      }

      if (newImageURL) {
        updateData.profileImage = newImageURL;
      } else if (user.photoURL) {
        updateData.profileImage = user.photoURL;
      }

      if (Object.keys(updateData).length > 0) {
        await firestore()
          .collection('app_users')
          .doc(user.uid)
          .update(updateData);
      }

      setShowNameUpdateModal(true);
      setTimeout(() => {
        setShowNameUpdateModal(false);
      }, 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 2000);
    } finally {
      setButtonLoading(false);
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
          Edit Profile
        </Text>
        <Text
          style={[
            styles.headerDescriptionText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          You can edit your profile here.
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
              onPress={handleImagePress}
              style={styles.imgContainer}>
              {newImageURL || photoURL ? (
                <Image
                  source={{uri: newImageURL || photoURL}}
                  style={styles.image}
                />
              ) : (
                <Image source={imgPlaceHolder} style={styles.image} />
              )}
            </TouchableOpacity>

            <View style={styles.infoContainer}>
              <View style={styles.nameContainer}>
                <Text
                  style={[
                    styles.label,
                    {
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                    },
                  ]}>
                  Full Name
                </Text>
                <TextInput
                  style={[
                    styles.inputField,
                    {
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                    },
                  ]}
                  placeholder="Enter Full Name"
                  placeholderTextColor={
                    colorScheme === 'dark' ? COLORS.white : COLORS.dark
                  }
                  value={fullName || ''}
                  onChangeText={text => {
                    handleFullNameChange(text);
                    handleFieldChange();
                  }}
                />
                {fullNameError && fullNameError ? (
                  <Text style={styles.errorText}>{fullNameError}</Text>
                ) : null}
              </View>

              <View style={styles.phoneContainer}>
                <Text
                  style={[
                    styles.label,
                    {
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                    },
                  ]}>
                  Phone
                </Text>
                <TextInput
                  style={[
                    styles.inputField,
                    {
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                    },
                  ]}
                  placeholder="Enter Phone Number"
                  placeholderTextColor={
                    colorScheme === 'dark' ? COLORS.white : COLORS.dark
                  }
                  value={phone || ''}
                  onChangeText={text => {
                    handlePhoneChange(text);
                    handleFieldChange();
                  }}
                />
                {phoneError && phoneError ? (
                  <Text style={styles.errorText}>{phoneError}</Text>
                ) : null}
              </View>

              <View style={styles.addressContainer}>
                <View>
                  <Text
                    style={[
                      styles.label,
                      {
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      },
                    ]}>
                    Address
                  </Text>
                  <TextInput
                    style={[
                      styles.inputField,
                      {
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      },
                    ]}
                    placeholder="Enter Address"
                    placeholderTextColor={
                      colorScheme === 'dark' ? COLORS.white : COLORS.dark
                    }
                    value={address || ''}
                    onChangeText={text => {
                      handleAddressChange(text);
                      handleFieldChange();
                    }}
                  />
                </View>
                {addressError && addressError ? (
                  <Text style={styles.errorText}>{addressError}</Text>
                ) : null}
              </View>
            </View>

            <View style={styles.editButtonContainer}>
              <TouchableOpacity
                disabled={!isUpdateEnabled()}
                onPress={handleUpdateProfile}>
                <View
                  style={[
                    styles.editContainer,
                    {
                      backgroundColor: isUpdateEnabled()
                        ? COLORS.primary
                        : COLORS.gray,
                    },
                  ]}>
                  <View style={styles.leftContainer}>
                    {buttonLoading ? (
                      <ActivityIndicator size={25} color={COLORS.white} />
                    ) : (
                      <>
                        <View style={styles.iconContainer}>
                          <Ionicons
                            name="pencil"
                            size={25}
                            color={COLORS.white}
                            style={{bottom: 2}}
                          />
                        </View>
                        <View style={styles.textContainer}>
                          <Text
                            style={[styles.editText, {color: COLORS.white}]}>
                            Update
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
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
        visible={showNameUpdateModal}
        onClose={() => setShowNameUpdateModal(false)}
        animationSource={require('../../../../assets/animations/success.json')}
        title="Success!"
        description="Profile updated successfully!"
      />

      <CustomModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        animationSource={require('../../../../assets/animations/error.json')}
        title="Update Failed"
        description="There was an error updating your profile!"
      />
    </SafeAreaView>
  );
};

export default DetailProfileScreen;

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
    fontSize: width * 0.09,
    color: COLORS.dark,
    fontFamily: FONTS.bold,
  },

  headerDescriptionText: {
    color: COLORS.dark,
    fontSize: width * 0.042,
    fontFamily: FONTS.medium,
    left: width * 0.01,
  },

  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: height * 0.005,
  },

  cardContainer: {
    alignItems: 'center',
    paddingVertical: height * 0.01,
  },

  imgContainer: {
    marginBottom: 20,
  },

  image: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: (width * 0.3) / 2,
    resizeMode: 'cover',
  },

  editButtonContainer: {
    marginTop: height * 0.05,
    alignItems: 'center',
  },

  editContainer: {
    width: width * 0.9,
    alignItems: 'center',
    paddingVertical: height * 0.018,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  editText: {
    fontSize: width * 0.045,
    color: COLORS.white,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    marginLeft: 10,
  },

  infoContainer: {
    alignItems: 'center',
    gap: height * 0.04,
  },

  label: {
    fontSize: width * 0.045,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
    marginBottom: height * 0.01,
  },

  inputField: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: COLORS.primary,
    paddingHorizontal: width * 0.03,
    fontSize: width * 0.045,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
    width: width * 0.9,
  },

  errorText: {
    position: 'absolute',
    bottom: -25,
    fontSize: width * 0.04,
    color: COLORS.errorColor,
    fontFamily: FONTS.semiBold,
    paddingHorizontal: 5,
  },
});
