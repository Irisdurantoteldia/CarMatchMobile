import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FSection from "../../Navigation/FSection";
import MatchCard from "../../Components/Matches/MatchCard";
import EmptyState from "../../Components/UI/EmptyState";
import { useMatches } from "../../Hooks/useMatches";

export default function Matches({ navigation }) {
  const { matches, loading, refreshMatches } = useMatches();

  const handleMatchPress = (matchedUser) => {
    // Navigate to chat screen with match details
    navigation.navigate("Chat", {
      matchId: matchedUser.matchId,
      user: matchedUser,
    });
  };

  const EmptyMatches = () => (
    <EmptyState
      iconName="heart"
      title="Encara no tens cap 'match'"
      subtitle="Segueix explorant per connectar amb més persones"
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Els teus 'matches'</Text>
          <TouchableOpacity onPress={refreshMatches}>
            <Ionicons name="refresh" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#007AFF"
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={matches}
            renderItem={({ item }) => (
              <MatchCard item={item} onPress={handleMatchPress} />
            )}
            keyExtractor={(item) => item.matchId}
            ListEmptyComponent={EmptyMatches}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {/* Fixed bottom navigation bar */}
      <View style={styles.bottomBar}>
        <FSection
          currentSection={4}
          onPress={(id) => {
            if (id === 1) navigation.navigate("Swipes");
            else if (id === 2) navigation.navigate("Search");
            else if (id === 3) navigation.navigate("Edit");
            else if (id === 4) navigation.navigate("Matches");
            else if (id === 5) navigation.navigate("Account");
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EEF5FF",
  },
  container: {
    flex: 1,
    padding: 15,
    paddingBottom: 60, // Add padding to account for fixed bottom bar
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    flexGrow: 1,
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
  },
});
