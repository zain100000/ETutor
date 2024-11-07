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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import imgPlaceHolder from '../../assets/placeholders/default-avatar.png';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {COLORS, FONTS} from '../constants/Constants';
import CustomModal from '../utils/modals/CustomModal';
import LogoutModal from '../utils/modals/LogoutModal';
import DeleteTutorProfileModal from '../utils/modals/DeleteTutorProfile';
import DeleteAccountModal from '../utils/modals/DeleteAccountModal';

const {width, height} = Dimensions.get('window');

const Profile = () => {
  const [image, setImage] = useState('');
  const [fullName, setFullName] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteTutorModal, setShowDeleteTutorModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [tutorProfile, setTutorProfile] = useState(false);
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

  const fetchTutorProfile = async () => {
    const user = authInstance.currentUser;
    if (user) {
      try {
        const tutorQuerySnapshot = await firestore()
          .collection('tutor_profile')
          .where('userId', '==', user.uid)
          .get();

        if (!tutorQuerySnapshot.empty) {
          return true;
        }
      } catch (error) {
        console.error('Error fetching tutor profile:', error);
      }
    }
    return false;
  };

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        await fetchUserData();
        const hasTutorProfile = await fetchTutorProfile();
        setTutorProfile(hasTutorProfile);
        setLoading(false);
      };

      loadData();
    }, []),
  );

  const handleLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const handleDeleteTutorModal = () => {
    setShowDeleteTutorModal(true);
  };

  const handleDeleteAccountModal = () => {
    setShowDeleteAccountModal(true);
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
          Profile
        </Text>
        <Text
          style={[
            styles.headerDescriptionText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Your Profile - Preferences.
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
          <View
            style={[
              styles.cardContainer,
              colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
            ]}>
            <View style={styles.profileHeaderContainer}>
              <View style={styles.profileLeftContainer}>
                <View style={styles.imgContainer}>
                  {image ? (
                    <Image source={{uri: image}} style={styles.img} />
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
                  {fullName}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.subCard,
                {
                  backgroundColor:
                    colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
                },
              ]}>
              <View style={styles.subCardContainer}>
                <View style={styles.subCardLeftContainer}>
                  <View style={styles.subCardIconContainer}>
                    <Ionicons
                      name="cog-outline"
                      size={25}
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
                      style={{
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                        fontSize: width * 0.045,
                        marginLeft: 10,
                      }}>
                      Account Settings
                    </Text>
                  </View>
                </View>

                <View style={styles.subCardRightContainer}>
                  <View style={styles.subCardIconContainer}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Edit_Profile')}>
                      <Ionicons
                        name="chevron-forward"
                        size={30}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            <View
              style={[
                styles.subCard,
                {
                  backgroundColor:
                    colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
                },
              ]}>
              <View style={styles.subCardContainer}>
                <View style={styles.subCardLeftContainer}>
                  <View style={styles.subCardIconContainer}>
                    <Ionicons
                      name="heart-outline"
                      size={25}
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
                      style={{
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                        fontSize: width * 0.045,
                        marginLeft: 10,
                      }}>
                      Favourites
                    </Text>
                  </View>
                </View>

                <View style={styles.subCardRightContainer}>
                  <View style={styles.subCardIconContainer}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Favourites')}>
                      <Ionicons
                        name="chevron-forward"
                        size={30}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {tutorProfile && (
              <View style={styles.tutorProfileContainer}>
                <View style={styles.subHeaderTextContainer}>
                  <Text
                    style={[
                      styles.subHeaderTitleText,
                      {
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      },
                    ]}>
                    Tutor Profile
                  </Text>
                </View>

                <View
                  style={[
                    styles.subCard,
                    {
                      backgroundColor:
                        colorScheme === 'dark'
                          ? COLORS.lightDark
                          : COLORS.white,
                    },
                  ]}>
                  <View style={styles.subCardContainer}>
                    <View style={styles.subCardLeftContainer}>
                      <View style={styles.subCardIconContainer}>
                        <Ionicons
                          name="eye-outline"
                          size={25}
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
                          style={{
                            color:
                              colorScheme === 'dark'
                                ? COLORS.white
                                : COLORS.dark,
                            fontSize: width * 0.045,
                            marginLeft: 10,
                          }}>
                          My Tutor Profile
                        </Text>
                      </View>
                    </View>

                    <View style={styles.subCardRightContainer}>
                      <View style={styles.subCardIconContainer}>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('My_Tutor_Profile')
                          }>
                          <Ionicons
                            name="chevron-forward"
                            size={30}
                            color={COLORS.primary}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>

                <View
                  style={[
                    styles.subCard,
                    {
                      backgroundColor:
                        colorScheme === 'dark'
                          ? COLORS.lightDark
                          : COLORS.white,
                    },
                  ]}>
                  <View style={styles.subCardContainer}>
                    <View style={styles.subCardLeftContainer}>
                      <View style={styles.subCardIconContainer}>
                        <Ionicons
                          name="pencil-outline"
                          size={25}
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
                          style={{
                            color:
                              colorScheme === 'dark'
                                ? COLORS.white
                                : COLORS.dark,
                            fontSize: width * 0.045,
                            marginLeft: 10,
                          }}>
                          Update Your Profile
                        </Text>
                      </View>
                    </View>

                    <View style={styles.subCardRightContainer}>
                      <View style={styles.subCardIconContainer}>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('Edit_Tutor_Profile')
                          }>
                          <Ionicons
                            name="chevron-forward"
                            size={30}
                            color={COLORS.primary}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>

                <View
                  style={[
                    styles.subCard,
                    {
                      backgroundColor:
                        colorScheme === 'dark'
                          ? COLORS.lightDark
                          : COLORS.white,
                    },
                  ]}>
                  <View style={styles.subCardContainer}>
                    <View style={styles.subCardLeftContainer}>
                      <View style={styles.subCardIconContainer}>
                        <Ionicons
                          name="trash-outline"
                          size={25}
                          style={[
                            styles.subCardIcon,
                            {
                              color:
                                colorScheme === 'dark'
                                  ? COLORS.errorColor
                                  : COLORS.errorColor,
                            },
                          ]}
                        />
                      </View>
                      <View style={styles.subCardTextContainer}>
                        <Text
                          style={{
                            color:
                              colorScheme === 'dark'
                                ? COLORS.errorColor
                                : COLORS.errorColor,
                            fontSize: width * 0.045,
                            marginLeft: 10,
                          }}>
                          Delete Tutor Profile
                        </Text>
                      </View>
                    </View>

                    <View style={styles.subCardRightContainer}>
                      <View style={styles.subCardIconContainer}>
                        <TouchableOpacity onPress={handleDeleteTutorModal}>
                          <Ionicons
                            name="chevron-forward"
                            size={30}
                            color={COLORS.primary}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>

                {!tutorProfile && (
                  <>
                    <View style={styles.subHeaderTextContainer}>
                      <Text
                        style={[
                          styles.subHeaderTitleText,
                          {
                            color:
                              colorScheme === 'dark'
                                ? COLORS.white
                                : COLORS.dark,
                          },
                        ]}>
                        Tutor
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.subCard,
                        {
                          backgroundColor:
                            colorScheme === 'dark'
                              ? COLORS.lightDark
                              : COLORS.white,
                        },
                      ]}>
                      <View style={styles.subCardContainer}>
                        <View style={styles.subCardLeftContainer}>
                          <View style={styles.subCardIconContainer}>
                            <Ionicons
                              name="user"
                              size={25}
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
                              style={{
                                color:
                                  colorScheme === 'dark'
                                    ? COLORS.white
                                    : COLORS.dark,
                                fontSize: width * 0.045,
                                marginLeft: 10,
                              }}>
                              Become a Tutor
                            </Text>
                          </View>
                        </View>

                        <View style={styles.subCardRightContainer}>
                          <View style={styles.subCardIconContainer}>
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate('Tutor_Profile')
                              }>
                              <Ionicons
                                name="chevron-forward"
                                size={30}
                                color={COLORS.primary}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                )}
              </View>
            )}

            <View style={styles.appGeneralContainer}>
              <View style={styles.subHeaderTextContainer}>
                <Text
                  style={[
                    styles.subHeaderTitleText,
                    {
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                    },
                  ]}>
                  App General
                </Text>
              </View>

              <View
                style={[
                  styles.subCard,
                  {
                    backgroundColor:
                      colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
                  },
                ]}>
                <View style={styles.subCardContainer}>
                  <View style={styles.subCardLeftContainer}>
                    <View style={styles.subCardIconContainer}>
                      <Ionicons
                        name="information-circle-outline"
                        size={25}
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
                        style={{
                          color:
                            colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                          fontSize: width * 0.045,
                          marginLeft: 10,
                        }}>
                        About App
                      </Text>
                    </View>
                  </View>

                  <View style={styles.subCardRightContainer}>
                    <View style={styles.subCardIconContainer}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('About')}>
                        <Ionicons
                          name="chevron-forward"
                          size={30}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.subCard,
                  {
                    backgroundColor:
                      colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
                  },
                ]}>
                <View style={styles.subCardContainer}>
                  <View style={styles.subCardLeftContainer}>
                    <View style={styles.subCardIconContainer}>
                      <Ionicons
                        name="shield-outline"
                        size={25}
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
                        style={{
                          color:
                            colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                          fontSize: width * 0.045,
                          marginLeft: 10,
                        }}>
                        Privacy Policy
                      </Text>
                    </View>
                  </View>

                  <View style={styles.subCardRightContainer}>
                    <View style={styles.subCardIconContainer}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Privacy_Policy')}>
                        <Ionicons
                          name="chevron-forward"
                          size={30}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.subCard,
                  {
                    backgroundColor:
                      colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
                  },
                ]}>
                <View style={styles.subCardContainer}>
                  <View style={styles.subCardLeftContainer}>
                    <View style={styles.subCardIconContainer}>
                      <Ionicons
                        name="briefcase-outline"
                        size={25}
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
                        style={{
                          color:
                            colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                          fontSize: width * 0.045,
                          marginLeft: 10,
                        }}>
                        Terms and Conditions
                      </Text>
                    </View>
                  </View>

                  <View style={styles.subCardRightContainer}>
                    <View style={styles.subCardIconContainer}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('Terms_and_Conditions')
                        }>
                        <Ionicons
                          name="chevron-forward"
                          size={30}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.subCard,
                  {
                    backgroundColor:
                      colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
                  },
                ]}>
                <View style={styles.subCardContainer}>
                  <View style={styles.subCardLeftContainer}>
                    <View style={styles.subCardIconContainer}>
                      <Ionicons
                        name="log-out-outline"
                        size={25}
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
                        style={{
                          color:
                            colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                          fontSize: width * 0.045,
                          marginLeft: 10,
                        }}>
                        Logout
                      </Text>
                    </View>
                  </View>

                  <View style={styles.subCardRightContainer}>
                    <View style={styles.subCardIconContainer}>
                      <TouchableOpacity onPress={handleLogoutModal}>
                        <Ionicons
                          name="chevron-forward"
                          size={30}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.subCard,
                  {
                    backgroundColor:
                      colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
                  },
                ]}>
                <View style={styles.subCardContainer}>
                  <View style={styles.subCardLeftContainer}>
                    <View style={styles.subCardIconContainer}>
                      <Ionicons
                        name="trash-outline"
                        size={25}
                        style={[
                          styles.subCardIcon,
                          {
                            color:
                              colorScheme === 'dark'
                                ? COLORS.errorColor
                                : COLORS.errorColor,
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.subCardTextContainer}>
                      <Text
                        style={{
                          color:
                            colorScheme === 'dark'
                              ? COLORS.errorColor
                              : COLORS.errorColor,
                          fontSize: width * 0.045,
                          marginLeft: 10,
                        }}>
                        Delete Account
                      </Text>
                    </View>
                  </View>

                  <View style={styles.subCardRightContainer}>
                    <View style={styles.subCardIconContainer}>
                      <TouchableOpacity onPress={handleDeleteAccountModal}>
                        <Ionicons
                          name="chevron-forward"
                          size={30}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              {!tutorProfile && (
                <>
                  <View style={styles.subHeaderTextContainer}>
                    <Text
                      style={[
                        styles.subHeaderTitleText,
                        {
                          color:
                            colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                        },
                      ]}>
                      Tutor
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.subCard,
                      {
                        backgroundColor:
                          colorScheme === 'dark'
                            ? COLORS.lightDark
                            : COLORS.white,
                      },
                    ]}>
                    <View style={styles.subCardContainer}>
                      <View style={styles.subCardLeftContainer}>
                        <View style={styles.subCardIconContainer}>
                          <Ionicons
                            name="school-outline"
                            size={25}
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
                            style={{
                              color:
                                colorScheme === 'dark'
                                  ? COLORS.white
                                  : COLORS.dark,
                              fontSize: width * 0.045,
                              marginLeft: 10,
                            }}>
                            Become a Tutor
                          </Text>
                        </View>
                      </View>

                      <View style={styles.subCardRightContainer}>
                        <View style={styles.subCardIconContainer}>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('Tutor_Profile')
                            }>
                            <Ionicons
                              name="chevron-forward"
                              size={30}
                              color={COLORS.primary}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      )}

      <DeleteAccountModal
        visible={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        title="Delete Account!"
        description="Are you sure to delete your account it will delete all of your data?"
      />

      <DeleteTutorProfileModal
        visible={showDeleteTutorModal}
        onClose={() => setShowDeleteTutorModal(false)}
        title="Delete Tutor Profile!"
        description="Are you sure to delete your tutor profile it will only delete your tutor profile?"
      />

      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Logout!"
        description="Are Your Sure You Want To Logout ?"
      />

      <CustomModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        animationSource={require('../../assets/animations/success.json')}
        title="Success!"
        description="Image Uploaded Successfully!"
      />

      <CustomModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        description="Error Fetching User Data. Please Try Again Later."
        animationSource={require('../../assets/animations/error.json')}
      />
    </SafeAreaView>
  );
};

export default Profile;

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

  subHeaderTextContainer: {
    marginLeft: width * 0.03,
    marginTop: height * 0.02,
  },

  subHeaderTitleText: {
    fontSize: width * 0.04,
    color: COLORS.dark,
    fontFamily: FONTS.semiBold,
  },

  headerDescriptionText: {
    color: COLORS.dark,
    fontSize: width * 0.042,
    fontFamily: FONTS.medium,
    left: width * 0.01,
  },

  cardContainer: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    gap: height * 0.03,
  },

  profileHeaderContainer: {
    paddingHorizontal: width * 0.01,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: height * 0.01,
  },

  profileLeftContainer: {
    flexDirection: 'row',
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
    fontSize: width * 0.055,
    fontFamily: FONTS.semiBold,
  },

  subCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: height * 0.02,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    width: width * 0.9,
  },

  subCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  subCardLeftContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: width * 0.02,
  },

  subCardIcon: {
    color: COLORS.dark,
  },

  appGeneralContainer: {
    marginTop: height * 0.02,
    gap: height * 0.02,
  },

  tutorProfileContainer: {
    marginTop: height * 0.02,
    gap: height * 0.02,
  },

  btnContainer: {
    marginTop: height * 0.01,
    gap: width * 0.05,
  },

  logoutContainer: {
    width: width * 0.9,
    alignItems: 'center',
    padding: height * 0.01,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },

  logoutText: {
    fontSize: width * 0.045,
    color: COLORS.white,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
});
