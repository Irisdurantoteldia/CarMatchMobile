import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Platform, StyleSheet, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from "react-native";
import FSection from "../../Navigation/FSection";
import MessageList from "../../Components/Chat/MessageList";
import ChatInput from "../../Components/Chat/ChatInput";
import { useMessages } from "../../Hooks/useMessages";
import { auth } from "../../FireBase/FirebaseConfig";

const BOTTOM_BAR_HEIGHT = 60;

export default function Chat({ route, navigation }) {
  const { matchId, user } = route.params;
  const {
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    loading,
    keyboardHeight,
    flatListRef,
    inputRef,
  } = useMessages(matchId);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
            keyboardVerticalOffset={Platform.OS === "ios" ? 20 : -200} // El 20 es el que ajuste el input sobre del teclat.
          >
            <MessageList
              messages={messages}
              loading={loading}
              flatListRef={flatListRef}
              currentUserId={auth.currentUser?.uid}
              keyboardHeight={keyboardHeight}
              style={styles.messageList}
              matchId={matchId}
            />

            <View style={styles.inputContainer}>
              <ChatInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                sendMessage={sendMessage}
                inputRef={inputRef}
                matchId={matchId}
              />
            </View>
          </KeyboardAvoidingView>
        </View>

        <View style={styles.bottomBar}>
          <FSection
            currentSection={4}
            onPress={(id) => {
              Keyboard.dismiss();
              if (id === 1) navigation.navigate("Swipes");
              else if (id === 2) navigation.navigate("Search");
              else if (id === 3) navigation.navigate("Edit");
              else if (id === 4) navigation.navigate("Matches");
              else if (id === 5) navigation.navigate("Account");
            }}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  messageList: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
    marginBottom: 25,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
    zIndex: 1,
    height: BOTTOM_BAR_HEIGHT,
  },
});
