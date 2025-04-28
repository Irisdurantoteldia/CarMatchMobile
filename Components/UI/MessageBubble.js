import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MessageBubble = ({ message, currentUserId }) => {
  const isCurrentUser = message.sender === currentUserId;

  return (
    <View
      style={[
        styles.container,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : styles.otherUserText,
          ]}
        >
          {message.text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    marginVertical: 3,
    maxWidth: "80%",
  },
  currentUserContainer: {
    alignSelf: "flex-end",
    marginLeft: "auto",
  },
  otherUserContainer: {
    alignSelf: "flex-start",
    marginRight: "auto",
  },
  bubble: {
    padding: 12,
    borderRadius: 20,
    minWidth: 80,
  },
  currentUserBubble: {
    backgroundColor: "#0084ff",
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: "#E8E8E8",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 2,
    lineHeight: 20,
  },
  currentUserText: {
    color: "#FFFFFF",
  },
  otherUserText: {
    color: "#000000",
  },
  timeText: {
    fontSize: 11,
    marginTop: 2,
  },
  currentUserTimeText: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  otherUserTimeText: {
    color: "#8E8E93",
  },
});

export default MessageBubble;
