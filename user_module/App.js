import React, {useState} from 'react';
import {StatusBar} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {COLORS} from './src/components/constants/Constants';
import Splash from './src/components/shared/Splash';
import OnBoarding from './src/components/shared/onBoarding';
import Signup from './src/components/shared/Signup';
import Signin from './src/components/shared/Signin';
import ForgotPassword from './src/components/shared/ForgotPassword';
import BottomNavigator from './src/components/navigation/BottomNavigator';
import ChangePassword from './src/components/shared/ChangePassword';
import DetailProfileScreen from './src/components/screens/extraScreens/ProfileUpdate/DetailProfileScreen';
import PrivacyPolicy from './src/components/shared/PrivacyPolicy';
import AppUsage from './src/components/shared/AppUsage';
import About from './src/components/shared/About';
import TutorProfile from './src/components/screens/extraScreens/Tutor/TutorProfile';
import MyTutorProfile from './src/components/screens/extraScreens/Tutor/MyTutorProfile';
import Profile from './src/components/screens/Profile';
import UpdateTutorProfile from './src/components/screens/extraScreens/Tutor/UpdateTutorProfile';
import SubjectTutorProfile from './src/components/utils/subjectTutorProfile/SubjectTutorProfile';
import SubjectTutorDetailedProfile from './src/components/utils/subjectTutorProfile/SubjectTutorDetailedProfile';
import ChatBox from './src/components/utils/chatbox/ChatBox';
import Inbox from './src/components/utils/chatbox/Inbox';

const Stack = createNativeStackNavigator();

const App = () => {
  const [statusBarColor, setStatusBarColor] = useState(COLORS.primary);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={statusBarColor} barStyle="light-content" />
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Splash">
        <Stack.Screen name="Splash">
          {props => <Splash {...props} setStatusBarColor={setStatusBarColor} />}
        </Stack.Screen>

        <Stack.Screen name="onBoard">
          {props => (
            <OnBoarding {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Signup">
          {props => <Signup {...props} setStatusBarColor={setStatusBarColor} />}
        </Stack.Screen>

        <Stack.Screen name="Signin">
          {props => <Signin {...props} setStatusBarColor={setStatusBarColor} />}
        </Stack.Screen>

        <Stack.Screen name="Forgot_Password">
          {props => (
            <ForgotPassword {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Change_Password">
          {props => (
            <ChangePassword {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Main">
          {props => (
            <BottomNavigator {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="About">
          {props => <About {...props} setStatusBarColor={setStatusBarColor} />}
        </Stack.Screen>

        <Stack.Screen name="Privacy_Policy">
          {props => (
            <PrivacyPolicy {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Terms_and_Conditions">
          {props => (
            <AppUsage {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Profile">
          {props => (
            <Profile {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Edit_Profile">
          {props => (
            <DetailProfileScreen
              {...props}
              setStatusBarColor={setStatusBarColor}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Tutor_Profile">
          {props => (
            <TutorProfile {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="My_Tutor_Profile">
          {props => (
            <MyTutorProfile {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Edit_Tutor_Profile">
          {props => (
            <UpdateTutorProfile
              {...props}
              setStatusBarColor={setStatusBarColor}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Subject_Tutor_Profile">
          {props => (
            <SubjectTutorProfile
              {...props}
              setStatusBarColor={setStatusBarColor}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Subject_Tutor_Detailed_Profile">
          {props => (
            <SubjectTutorDetailedProfile
              {...props}
              setStatusBarColor={setStatusBarColor}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Chat_Box">
          {props => (
            <ChatBox {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Inbox">
          {props => <Inbox {...props} setStatusBarColor={setStatusBarColor} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
