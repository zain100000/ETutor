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
import imgPlaceHolder from '../../../assets/placeholders/default-avatar.png';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {COLORS, FONTS} from '../../constants/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width, height} = Dimensions.get('window');

const Inbox = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = auth().currentUser.uid;
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      const tutorProfileSnapshot = await firestore()
        .collection('tutor_profile')
        .where('userId', '==', currentUserId)
        .get();

      let tutorId = null;
      if (!tutorProfileSnapshot.empty) {
        tutorId = tutorProfileSnapshot.docs[0].data().tutorId;
      }

      const studentChats = await firestore()
        .collection('chats')
        .where('participants.studentId', '==', currentUserId)
        .get();

      const tutorChats = tutorId
        ? await firestore()
            .collection('chats')
            .where('participants.tutorId', '==', tutorId)
            .get()
        : null;

      const combinedSnapshot = tutorChats
        ? studentChats.docs.concat(tutorChats.docs)
        : studentChats.docs;

      const chatList = await Promise.all(
        combinedSnapshot.map(async doc => {
          const chatData = doc.data();
          const otherParticipantId =
            chatData.participants.studentId === currentUserId
              ? chatData.participants.tutorId
              : chatData.participants.studentId;

          const participantDetails = otherParticipantId
            ? await firestore()
                .collection(
                  chatData.participants.studentId === currentUserId
                    ? 'tutor_profile'
                    : 'app_users',
                )
                .doc(otherParticipantId)
                .get()
            : {};

          return {
            id: doc.id,
            ...chatData,
            participantName: participantDetails.exists
              ? participantDetails.data().fullName
              : 'Unknown',
            participantImage: participantDetails.exists
              ? participantDetails.data().profileImage
              : null,
          };
        }),
      );

      setChats(chatList);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useFocusEffect(
    useCallback(() => {
      fetchChats();
      return () => setChats([]);
    }, [fetchChats]),
  );

  const handleNavigateToChatBox = (chatId, tutorId) => {
    navigation.navigate('Chat_Box', {chatId, tutorId});
  };

  const renderChatItem = ({item}) => {
    const {participantName, participantImage, messages} = item;
    const lastMessage =
      messages && messages.length > 0 ? messages[messages.length - 1] : null;

    const otherParticipantId =
      item.participants.studentId === currentUserId
        ? item.participants.tutorId
        : item.participants.studentId;

    return (
      <TouchableOpacity
        style={[
          styles.chatCard,
          colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
        ]}
        onPress={() => handleNavigateToChatBox(item.id, otherParticipantId)}>
        <View
          style={[
            styles.chatCardContainer,
            colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          ]}>
          <View style={styles.leftChatContainer}>
            <View style={styles.imgContainer}>
              {participantImage ? (
                <Image source={{uri: participantImage}} style={styles.img} />
              ) : (
                <Image source={imgPlaceHolder} style={styles.img} />
              )}
            </View>

            <View style={styles.chatNameContainer}>
              <Text
                style={[
                  styles.chatName,
                  colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                ]}>
                {participantName}
              </Text>

              <Text
                style={[
                  styles.lastMessage,
                  colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                ]}>
                {lastMessage ? lastMessage.message : 'No messages yet'}
              </Text>
            </View>
          </View>

          <View style={styles.rightContainer}>
            <Text
              style={[
                styles.timestamp,
                colorScheme === 'dark' ? COLORS.white : COLORS.dark,
              ]}>
              {lastMessage
                ? new Date(lastMessage.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
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
          Inbox
        </Text>
        <Text
          style={[
            styles.headerDescriptionText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          All chats will be shown here.
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
        <View style={styles.chatsContainer}>
          <FlatList
            data={chats}
            keyExtractor={item => item.id}
            renderItem={renderChatItem}
            contentContainerStyle={styles.chatList}
            ListEmptyComponent={
              <View style={styles.noChatContainer}>
                <Text
                  style={[
                    styles.noChatText,
                    {
                      color:
                        colorScheme === 'dark'
                          ? COLORS.white
                          : COLORS.darkColor,
                    },
                  ]}>
                  No Chats Found!
                </Text>
              </View>
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Inbox;

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

  chatCard: {
    marginVertical: height * 0.05,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.lightGray,
  },

  chatCardContainer: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    gap: height * 0.03,
  },

  chatCardContainer: {
    paddingHorizontal: width * 0.01,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: height * 0.01,
    margin: width * 0.02,
  },

  leftChatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  imgContainer: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.25) / 2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    marginRight: width * 0.03,
    marginTop: height * 0.01,
  },

  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  chatName: {
    fontSize: width * 0.045,
    fontFamily: FONTS.semiBold,
  },

  lastMessage: {
    fontSize: width * 0.035,
    fontFamily: FONTS.semiBold,
  },

  timestamp: {
    fontSize: width * 0.035,
    fontFamily: FONTS.semiBold,
  },

  noChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.55,
  },

  noChatText: {
    fontSize: width * 0.05,
    fontFamily: FONTS.semiBold,
    textAlign: 'center',
  },
});
