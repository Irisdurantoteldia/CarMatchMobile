import { useState, useEffect, useRef } from "react";
import { Alert, Keyboard, Platform } from "react-native";
import {
  subscribeToMessages,
  sendMessage,
} from "../Services/messageService";

export const useMessages = (matchId) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef(null);
  const inputRef = useRef(null);

  // Subscribe to keyboard events
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  // Subscribe to messages
  useEffect(() => {
    const unsubscribe = subscribeToMessages(matchId, (messagesList) => {
      setMessages(messagesList);
      setLoading(false);

      if (flatListRef.current && messagesList.length > 0) {
        setTimeout(
          () => flatListRef.current.scrollToEnd({ animated: true }),
          200
        );
      }
    });

    return unsubscribe;
  }, [matchId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      await sendMessage(matchId, newMessage);
      setNewMessage("");
      Keyboard.dismiss();
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert(
        "Error",
        "No s'ha pogut enviar el missatge. Torna-ho a provar."
      );
    }
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    sendMessage: handleSendMessage,
    loading,
    keyboardHeight,
    flatListRef,
    inputRef,
  };
};