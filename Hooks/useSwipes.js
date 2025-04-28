import { useState, useEffect, useRef } from "react";
import { Alert, Animated, Dimensions } from "react-native";
import { getSwipeUsers } from "../Services/userService";
import { recordSwipe } from "../Services/matchService";
import { auth } from "../FireBase/FirebaseConfig";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;

export const useSwipes = (selectedUserId, userData) => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [detailedView, setDetailedView] = useState(false);
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  });
  const [loading, setLoading] = useState(true);

  const refreshUsers = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        setLoading(true);
        const userList = await getSwipeUsers(user.uid);
        setUsers(userList);
        setCurrentIndex(0);
      } catch (error) {
        console.error("Error fetching users:", error);
        Alert.alert(
          "Error",
          "No s'han pogut carregar els usuaris. Si us plau, torna-ho a provar més tard."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          setLoading(true);
          const userList = await getSwipeUsers(user.uid);
          setUsers(userList);
        } catch (error) {
          console.error("Error fetching users:", error);
          Alert.alert(
            "Error",
            "No s'han pogut carregar els usuaris. Si us plau, torna-ho a provar més tard."
          );
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        Alert.alert(
          "Error",
          "No s'ha pogut carregar els usuaris. Si us plau, torna-ho a provar més tard."
        );
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSwipe = async (type) => {
    if (users.length === 0 || currentIndex >= users.length) {
      return;
    }

    const swipedUser = users[currentIndex];

    try {
      await recordSwipe(swipedUser.userId, type);
      nextUser();
    } catch (error) {
      console.error("Error handling swipe:", error);
      Alert.alert(
        "Error",
        "No s'ha pogut processar l'acció. Si us plau, torna-ho a provar."
      );
    }
  };

  const nextUser = () => {
    setCurrentIndex((prevIndex) => {
      // Check if this is the last user
      if (prevIndex >= users.length - 1) {
        Alert.alert("Fi", "No hi ha més usuaris per mostrar.");
        return users.length; // Set index beyond the array length
      }
      return prevIndex + 1;
    });
    setDetailedView(false);
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver: false,
    }).start();
  };

  const handleLike = () => handleSwipe("like");
  const handleDislike = () => handleSwipe("dislike");

  const toggleDetailedView = () => {
    setDetailedView(!detailedView);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver: false,
    }).start();
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, "users");
      const unavailabilityRef = collection(db, "unavailability");

      // Get all unavailable users
      const now = new Date();
      const unavailabilityQuery = await getDocs(query(unavailabilityRef, 
        where("endDate", ">", now.toISOString())
      ));

      const unavailableUserIds = unavailabilityQuery.docs.map(doc => doc.data().userId);

      // Modify your existing users query to exclude unavailable users
      const usersQuery = query(usersRef, 
        where("userId", "not-in", unavailableUserIds)
      );

      const querySnapshot = await getDocs(usersQuery);
      const fetchedUsers = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(user => user.userId !== auth.currentUser?.uid);

      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};