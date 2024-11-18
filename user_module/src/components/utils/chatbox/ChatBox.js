import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS} from '../../constants/Constants';
import imgPlaceHolder from '../../../assets/placeholders/default-avatar.png';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const {width, height} = Dimensions.get('window');

const ChatBox = () => {
  const route = useRoute();
  const {chatId, otherParticipantId} = route.params;
  const [studentId, setStudentId] = useState(auth().currentUser?.uid);
  const [image, setImage] = useState('');
  const [fullName, setFullName] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatExists, setChatExists] = useState(false);
  const [chatIdState, setChatIdState] = useState(chatId);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const flatListRef = useRef(null);

  const fetchParticipantProfile = async () => {
    try {
      let participantData;

      const studentDoc = await firestore()
        .collection('app_users')
        .doc(otherParticipantId)
        .get();

      if (studentDoc.exists) {
        participantData = studentDoc.data();
      } else {
        const tutorDoc = await firestore()
          .collection('tutor_profile')
          .doc(otherParticipantId)
          .get();

        if (tutorDoc.exists) {
          participantData = tutorDoc.data();
        }
      }

      if (participantData) {
        setFullName(participantData.fullName);
        setImage(
          participantData.profileImage
            ? participantData.profileImage
            : imgPlaceHolder,
        );
      }
    } catch (error) {
      console.error('Error fetching participant profile:', error);
    }
  };

  useEffect(() => {
    const checkForChat = async () => {
      if (!chatIdState) {
        try {
          const chatQuery = await firestore()
            .collection('chats')
            .where('participants.studentId', '==', studentId)
            .where('participants.tutorId', '==', otherParticipantId)
            .get();

          if (!chatQuery.empty) {
            const chatDoc = chatQuery.docs[0];
            setChatIdState(chatDoc.id);
            setChatExists(true);
          } else {
            const newChatRef = firestore().collection('chats').doc();
            await newChatRef.set({
              participants: {studentId, tutorId: otherParticipantId},
              messages: [],
              createdAt: firestore.FieldValue.serverTimestamp(),
            });
            setChatIdState(newChatRef.id);
            setChatExists(false);
          }
        } catch (error) {
          console.error('Error checking for chat:', error);
        }
      }
    };

    if (studentId && otherParticipantId) {
      checkForChat();
    }
  }, [studentId, otherParticipantId, chatIdState]);

  useEffect(() => {
    if (chatIdState) {
      const unsubscribe = firestore()
        .collection('chats')
        .doc(chatIdState)
        .onSnapshot(
          doc => {
            if (doc.exists) {
              const fetchedMessages = doc.data().messages || [];

              if (Array.isArray(fetchedMessages)) {
                const sortedMessages = fetchedMessages.sort((a, b) => {
                  const timestampA =
                    a.timestamp instanceof firestore.Timestamp
                      ? a.timestamp.toDate()
                      : new Date(a.timestamp);
                  const timestampB =
                    b.timestamp instanceof firestore.Timestamp
                      ? b.timestamp.toDate()
                      : new Date(b.timestamp);
                  return timestampA - timestampB;
                });

                setMessages(sortedMessages);

                const updateReadStatus = async () => {
                  const unreadMessages = fetchedMessages.filter(
                    msg => msg.status === 'sent' && msg.senderId !== studentId,
                  );

                  if (unreadMessages.length > 0) {
                    const updatedMessages = fetchedMessages.map(msg =>
                      msg.status === 'sent' && msg.senderId !== studentId
                        ? {...msg, status: 'read'}
                        : msg,
                    );

                    await firestore()
                      .collection('chats')
                      .doc(chatIdState)
                      .update({
                        messages: updatedMessages,
                      });
                  }
                };

                updateReadStatus();
                flatListRef.current?.scrollToEnd();
              }
            } else {
              setMessages([]);
            }
          },
          error => {
            console.error('Error fetching chat messages:', error);
          },
        );

      return () => unsubscribe();
    }
  }, [chatIdState, studentId]);

  useFocusEffect(
    useCallback(() => {
      fetchParticipantProfile();
    }, [otherParticipantId]),
  );

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      return;
    }

    const currentUserId = auth().currentUser?.uid;

    if (!currentUserId) {
      return;
    }

    try {
      const messageData = {
        senderId: currentUserId,
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
        status: 'sent',
      };

      const chatRef = firestore().collection('chats').doc(chatIdState);

      await chatRef.update({
        messages: firestore.FieldValue.arrayUnion(messageData),
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderItem = ({item}) => {
    const isSent = item.senderId === studentId;
    const isRead = item.status === 'read';

    return (
      <View
        style={[
          styles.messageContainer,
          isSent
            ? styles.sentMessageContainer
            : styles.receivedMessageContainer,
        ]}>
        <View
          style={[
            styles.messageBubble,
            isSent
              ? {
                  backgroundColor:
                    colorScheme === 'dark' ? COLORS.primary : COLORS.primary,
                }
              : {
                  backgroundColor:
                    colorScheme === 'dark' ? COLORS.dark : COLORS.dark,
                },
          ]}>
          <Text
            style={[
              styles.messageText,
              isSent
                ? {color: colorScheme === 'dark' ? COLORS.white : COLORS.white}
                : {color: colorScheme === 'dark' ? COLORS.white : COLORS.white},
            ]}>
            {item.message}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isSent
                ? {color: colorScheme === 'dark' ? COLORS.white : COLORS.white}
                : {color: colorScheme === 'dark' ? COLORS.white : COLORS.white},
            ]}>
            {new Date(item.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>

          <View style={styles.messageStatus}>
            {isSent && (
              <Ionicons
                name={isRead ? 'checkmark-done' : 'checkmark'}
                size={25}
                color={isRead ? '#000080' : '#999'}
              />
            )}
          </View>
        </View>
      </View>
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
        <View style={styles.imgContainer}>
          <Image
            source={typeof image === 'string' ? {uri: image} : imgPlaceHolder}
            style={styles.img}
          />
        </View>
        <View style={styles.headerTitleContainer}>
          <Text
            style={[
              styles.name,
              {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
            ]}>
            {fullName}
          </Text>
        </View>
      </View>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ref={flatListRef}
        style={styles.chatContainer}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Message"
          placeholderTextColor={
            colorScheme === 'dark' ? COLORS.dark : COLORS.dark
          }
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons
            name="send"
            size={20}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.white}
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatBox;

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
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.04,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gray,
  },

  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: width * 0.04,
  },

  leftChatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  imgContainer: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    marginLeft: width * 0.03,
  },

  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  name: {
    fontSize: width * 0.05,
    fontFamily: FONTS.semiBold,
  },

  chatContainer: {
    flex: 1,
    marginTop: width * 0.2,
  },

  messageContainer: {
    flexDirection: 'row',
    marginTop: height * 0.025,
    paddingHorizontal: width * 0.05,
  },

  sentMessageContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  receivedMessageContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  messageBubble: {
    maxWidth: width * 0.8,
    padding: width * 0.05,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  messageText: {
    fontSize: width * 0.04,
    fontFamily: FONTS.semiBold,
    flexShrink: 1,
  },

  messageTime: {
    fontSize: width * 0.03,
    fontFamily: FONTS.semiBold,
    marginLeft: width * 0.02,
  },

  messageStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: width * 0.02,
    top: height * 0.01,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    marginBottom: height * 0.009,
    gap: width * 0.015,
  },

  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    fontSize: width * 0.045,
    color: COLORS.dark,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },

  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.12,
    height: width * 0.12,
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
});
