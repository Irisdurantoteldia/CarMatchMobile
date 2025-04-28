import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import { auth } from "../../FireBase/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg("Si us plau, omple tots els camps.");
      return;
    }
    setErrorMsg(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Swipes");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-credential":
          setErrorMsg(
            "Credencials incorrectes. Revisa el correu i la contrasenya."
          );
          break;
        default:
          setErrorMsg("Error inesperat. Torna-ho a intentar.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginBox}>
        <Image source={require("../../assets/CarMatch.png")} style={styles.logo} />
        <Text style={styles.title}>Benvingut a CarMatch!</Text>

        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Email..."
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#aaa"
        />

        <TextInput
          style={styles.input}
          placeholder="Password..."
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#aaa"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sessió</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.registerText}>
            No tens compte?{" "}
            <Text style={styles.registerTextBold}>Registra't</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF5FF",
  },
  loginBox: {
    width: "85%",
    alignItems: "center",
    backgroundColor: "white",
    padding: 30,
    borderRadius: 15,
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
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1E3A8A",
    textAlign: "center",
  },
  errorText: {
    color: "#E53935",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 55,
    borderColor: "#BBDEFB",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#F5FAFF",
    fontSize: 16,
    color: "#1E3A8A",
  },
  button: {
    backgroundColor: "#333c87",
    paddingVertical: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerLink: {
    marginTop: 25,
    padding: 10,
  },
  registerText: {
    color: "#1E3A8A",
    fontSize: 16,
    textAlign: "center",
  },
  registerTextBold: {
    fontWeight: "bold",
    color: "red",
  },
});
