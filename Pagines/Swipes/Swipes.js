import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  SafeAreaView,
  Platform,
} from "react-native";
import FSection from "../../Navigation/FSection";
import EmptyState from "../../Components/UI/EmptyState";
import Loader from "../../Components/UI/Loader";
import SwipeCard from "../../Components/Swipes/SwipeCard";
import SwipeButtons from "../../Components/Swipes/SwipeButtons";
import { useSwipes } from "../../Hooks/useSwipes";

const SCREEN_WIDTH = Dimensions.get("window").width;

// TODO - Les que ja estiguin donades de like o dislike que no es tronin a mostrar, sino que on la de edit surtin i alla pugui canviar per si canvien sas.
export default function Swipes({ navigation, route }) {
  const selectedUserId = route.params?.selectedUserId;
  const userData = route.params?.userData;

  const {
    users,
    currentIndex,
    detailedView,
    position,
    rotation,
    loading,
    handleLike,
    handleDislike,
    toggleDetailedView,
    resetPosition,
    SWIPE_THRESHOLD,
    refreshUsers,
  } = useSwipes(selectedUserId, userData);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // Solo permitir gestos de deslizamiento si no estamos intentando hacer scroll
        const { dx, dy } = gestureState;
        return Math.abs(dx) > Math.abs(dy) && !detailedView;
      },
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          handleLike();
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          handleDislike();
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const renderContent = () => {
    if (loading) {
      return <Loader message="Carregant usuaris..." />;
    }

    // Add debug logs
    ('Route params:', route.params);

    // Show specific user if coming from Search
    if (route.params?.selectedUserId) {
      // Utilitzem directament les dades de l'usuari que hem passat
      const selectedUser = route.params.userData;
      
      if (selectedUser) {
        return (
          <>
            <Animated.View style={[styles.card]}>
              <SwipeCard
                user={selectedUser}
                detailedView={detailedView}
                onToggleDetailedView={toggleDetailedView}
              />
            </Animated.View>
            <View style={styles.buttonContainer}>
              <SwipeButtons 
                onLike={() => {
                  handleLike();
                  navigation.goBack();
                }} 
                onDislike={() => {
                  handleDislike();
                  navigation.goBack();
                }} 
              />
            </View>
          </>
        );
      }
    }

    // Original content for normal swipes
    if (users.length === 0) {
      return (
        <EmptyState
          iconName="people"
          title="No hi ha usuaris per mostrar"
          subtitle="Torna més tard per veure nous usuaris"
        />
      );
    }

    if (currentIndex >= users.length) {
      return (
        <EmptyState
          iconName="checkmark-circle"
          title="Has vist tots els usuaris"
          subtitle="Torna més tard per veure nous usuaris"
        />
      );
    }

    const user = users[currentIndex];

    return (
      <>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate: rotation },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <SwipeCard
            user={user}
            detailedView={detailedView}
            onToggleDetailedView={toggleDetailedView}
          />
        </Animated.View>

        <View style={styles.buttonContainer}>
          <SwipeButtons onLike={handleLike} onDislike={handleDislike} />
        </View>
      </>
    );
  };

  // Add useEffect to refresh users when focusing the screen
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshUsers();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>{renderContent()}</View>
      </View>

      {/* Bottom navigation bar */}
      <View style={styles.bottomBar}>
        <FSection
          currentSection={1}
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
    paddingBottom: 80, // Add padding to account for fixed bottom bar
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
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#2962FF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  card: {
    width: SCREEN_WIDTH * 0.9,
    height: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
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
