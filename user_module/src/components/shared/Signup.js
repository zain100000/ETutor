import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
  useColorScheme,
  ScrollView,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS} from '../constants/Constants';
import CustomModal from '../utils/modals/CustomModal';
import firebase from '@react-native-firebase/app';

const {width, height} = Dimensions.get('window');

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordStrengthColor, setPasswordStrengthColor] = useState(
    COLORS.dark,
  );

  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [loading, setLoading] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEmailExistsErrorModal, setShowEmailExistsErrorModal] =
    useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const statusBarColor =
      colorScheme === 'dark' ? COLORS.darkColor : COLORS.primary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(
      colorScheme === 'dark' ? 'light-content' : 'dark-content',
    );
  });

  useEffect(() => {
    setIsButtonEnabled(isValidInput());
  }, [fullName, email, password]);

  const isValidInput = () => {
    const fullNamePattern = /^[a-zA-Z\s]*$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    const isFullNameValid = fullNamePattern.test(fullName);
    const isEmailValid = emailPattern.test(email);
    const isPasswordValid = passwordPattern.test(password);

    return isFullNameValid && isEmailValid && isPasswordValid;
  };

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

  const handleEmailChange = value => {
    setEmail(value);
    if (value === '') {
      setEmailError('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('Enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = value => {
    setPassword(value);
    checkPasswordStrength(value);
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (value === '') {
      setPasswordError('Password is required');
    } else if (!passwordPattern.test(value)) {
      setPasswordError('');
    } else {
      setPasswordError('');
    }
  };

  const checkPasswordStrength = password => {
    const strongPasswordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    const averagePasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (strongPasswordRegex.test(password)) {
      setPasswordStrength('Strong');
      setPasswordStrengthColor(COLORS.strongColor);
      setActiveIndex(2);
    } else if (averagePasswordRegex.test(password)) {
      setPasswordStrength('Average');
      setPasswordStrengthColor(COLORS.averageColor);
      setActiveIndex(1);
    } else {
      setPasswordStrength('Weak');
      setPasswordStrengthColor(COLORS.weakColor);
      setActiveIndex(0);
    }
  };

  const validateFullName = () => {
    const regex = /^[a-zA-Z\s]+$/;
    if (!fullName || !regex.test(fullName)) {
      return 'Full name is required and should contain only alphabets';
    }
    return '';
  };

  const validateEmail = () => {
    if (!email) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = () => {
    if (!password) {
      return 'Password is required';
    }
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return 'Password must be at least 8 characters long with uppercase, lowercase, number, and special character';
    }
    return '';
  };

  const handleRegister = async () => {
    setLoading(true);

    const fullNameError = validateFullName();
    const emailError = validateEmail();
    const passwordError = validatePassword();

    if (fullNameError || emailError || passwordError) {
      setLoading(false);
      return;
    }

    setShowAuthModal(true);

    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await firebase.firestore().collection('app_users').doc(user.uid).set({
        fullName: fullName,
        email: email,
      });

      setShowAuthModal(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.navigate('Signin');
      }, 3000);
    } catch (error) {
      console.log(error);
      setShowAuthModal(false);
      if (error.code === 'auth/email-already-in-use') {
        setShowEmailExistsErrorModal(true);
        setTimeout(() => {
          setShowEmailExistsErrorModal(false);
        }, 2000);
      }
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
        <TouchableOpacity onPress={() => navigation.goBack('Login')}>
          <Ionicons
            name="chevron-back"
            size={30}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.welcomeContainer}>
          <Text
            style={[
              styles.welcomeTitleText,
              {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
            ]}>
            Register
          </Text>
          <Text
            style={[
              styles.welcomeDescriptionText,
              {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
            ]}>
            Fill up the form to get registered.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.nameContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Full Name
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholder="Enter Your Full Name"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.dark
              }
              keyboardType="name-phone-pad"
              value={fullName}
              onChangeText={handleFullNameChange}
            />
            {fullNameError && fullNameError ? (
              <Text style={styles.errorText}>{fullNameError}</Text>
            ) : null}
          </View>

          <View style={styles.emailContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Email
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholder="Enter Your Email"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.dark
              }
              keyboardType="email-address"
              value={email}
              onChangeText={handleEmailChange}
            />
            {emailError && emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>

          <View style={styles.passwordContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Password
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={[
                  styles.inputField,
                  {
                    flex: 1,
                    paddingRight: 40,
                    color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                  },
                ]}
                placeholder="Enter Your Password"
                placeholderTextColor={
                  colorScheme === 'dark' ? COLORS.gray : COLORS.dark
                }
                value={password}
                secureTextEntry={hidePassword}
                onChangeText={handlePasswordChange}
              />
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setHidePassword(!hidePassword)}>
                <Ionicons
                  name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
                  size={25}
                  color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
                />
              </TouchableOpacity>
            </View>

            {password !== '' && (
              <View style={styles.passwordStrengthContainer}>
                <View style={styles.passwordStrengthRow}>
                  <Text
                    style={[
                      styles.passwordStrengthText,
                      {color: passwordStrengthColor},
                    ]}>
                    {passwordStrength}
                  </Text>
                  <View style={styles.paginationContainer}>
                    {[...Array(3)].map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.dot,
                          {
                            backgroundColor:
                              index <= activeIndex
                                ? passwordStrengthColor
                                : COLORS.gray,
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </View>
            )}

            {passwordError && passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>

          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={[
                styles.signupBtn,
                {
                  backgroundColor: isButtonEnabled
                    ? COLORS.primary
                    : COLORS.gray,
                },
              ]}
              disabled={!isButtonEnabled}
              onPress={handleRegister}>
              <Text style={styles.signupText}>
                {loading ? (
                  <ActivityIndicator color={COLORS.white} size={25} />
                ) : (
                  'Sign up'
                )}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.extraContainer}>
            <Text
              style={{
                fontSize: width * 0.04,
                color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                fontFamily: FONTS.bold,
              }}>
              I have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
              <Text style={styles.extraText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <CustomModal
        visible={showAuthModal}
        title="Working!"
        description="Please Wait While Creating Your Account."
        animationSource={require('../../assets/animations/email.json')}
        onClose={() => setShowAuthModal(false)}
      />

      <CustomModal
        visible={showSuccessModal}
        title="Success!"
        description="Your Account Has Been Created Successfully"
        animationSource={require('../../assets/animations/success.json')}
        onClose={() => setShowSuccessModal(false)}
      />

      <CustomModal
        visible={showEmailExistsErrorModal}
        title="Failure!"
        description="Email already exists!"
        animationSource={require('../../assets/animations/error.json')}
        onClose={() => setShowEmailExistsErrorModal(false)}
      />
    </SafeAreaView>
  );
};

export default Signup;

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

  scrollViewContainer: {
    paddingVertical: height * 0.03,
    marginTop: height * 0.005,
  },

  welcomeContainer: {
    marginTop: height * 0.1,
    marginLeft: width * 0.05,
  },

  welcomeTitleText: {
    fontSize: width * 0.09,
    color: COLORS.dark,
    fontFamily: FONTS.bold,
  },

  welcomeDescriptionText: {
    color: COLORS.dark,
    fontSize: width * 0.042,
    fontFamily: FONTS.medium,
    width: width * 0.9,
    lineHeight: height * 0.03,
  },

  formContainer: {
    marginTop: height * 0.02,
    marginHorizontal: width * 0.05,
    gap: 30,
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
  },

  eyeIconContainer: {
    position: 'absolute',
    right: width * 0.03,
  },

  btnContainer: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
  },

  signupBtn: {
    width: '100%',
    alignItems: 'center',
    padding: height * 0.02,
    top: height * 0.035,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },

  signupText: {
    fontSize: width * 0.045,
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
  },

  extraContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    top: height * 0.065,
    padding: height * 0.05,
    gap: 20,
  },

  extraText: {
    fontSize: width * 0.045,
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },

  errorText: {
    position: 'absolute',
    bottom: -25,
    fontSize: width * 0.04,
    color: COLORS.errorColor,
    fontFamily: FONTS.semiBold,
    paddingHorizontal: 5,
  },

  passwordStrengthContainer: {
    marginTop: 5,
  },

  passwordStrengthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.02,
  },

  passwordStrengthText: {
    fontSize: width * 0.045,
    fontFamily: FONTS.semiBold,
  },

  paginationContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },

  dot: {
    width: width * 0.12,
    height: width * 0.02,
    margin: width * 0.01,
    borderRadius: width * 0.02,
  },
});
