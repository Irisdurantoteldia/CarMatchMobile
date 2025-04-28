import React, { useEffect } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import MessageBubble from "../UI/MessageBubble";
import EmptyChat from "./EmptyChat";

const MessageList = ({
  messages,
  loading,
  flatListRef,
  currentUserId,
  keyboardHeight,
  matchId,
}) => {
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const renderMessage = ({ item }) => {
    const isMyMessage = item.senderId === currentUserId;
    return (
      <View
        style={[
          styles.messageRow,
          isMyMessage ? styles.myMessageRow : styles.otherMessageRow,
        ]}
      >
        <MessageBubble
          message={item}
          currentUserId={currentUserId}
          matchId={matchId}
          isMyMessage={isMyMessage}
        />
      </View>
    );
  };

  return (
    <View style={styles.messagesContainer}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.messagesList,
            { paddingBottom: keyboardHeight + 10 },
          ]}
          ListEmptyComponent={<EmptyChat />}
          onContentSizeChange={() => {
            if (messages.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: false });
            }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messagesList: {
    flexGrow: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageRow: {
    flexDirection: "row",
    marginVertical: 2,
  },
  myMessageRow: {
    justifyContent: "flex-end",
  },
  otherMessageRow: {
    justifyContent: "flex-start",
  },
});

export default MessageList;
