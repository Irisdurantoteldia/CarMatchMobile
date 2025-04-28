import { useState } from "react"
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from "react-native"
import { ProgressBar } from "react-native-paper"
import { auth, db } from "../../FireBase/FirebaseConfig"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { collection, addDoc } from "firebase/firestore"
import SelectorPreferences from "../../Selectors/SelectorPreferences"

export default function SignUp({ navigation }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [location, setLocation] = useState("")
  const [desti, setDesti] = useState("")
  const [carInfo, setCarInfo] = useState(["", "", ""]) // [Model, Color, Places]
  const [horaEntrada, setHoraEntrada] = useState("")
  const [horaSortida, setHoraSortida] = useState("")
  const [preferencies, setPreferencies] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [detailedSchedule, setDetailedSchedule] = useState(Array(5).fill({ entrada: "", sortida: "" }))
  const [errorMsg, setErrorMsg] = useState(null)

  const totalSteps = 9
  const progress = step / totalSteps

  // Funció per passar a l'horari detallat
  const goToDetailedSchedule = () => {
    // Actualitzar tots els dies amb l'horari general
    const updatedSchedule = Array(5).fill({
      entrada: horaEntrada,
      sortida: horaSortida,
    })

    setDetailedSchedule(updatedSchedule)
    setStep(7)
  }

  const handleSignUp = async () => {
    if (!name || !email || !password || !location) {
      setErrorMsg("Si us plau, omple tots els camps.")
      return
    }
    setErrorMsg(null)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      const weeklyScheduleRef = await addDoc(collection(db, "weeklySchedule"), {
        userId: user.uid,
        days: step === 7 ? detailedSchedule : Array(5).fill({ horaEntrada, horaSortida }),
      })

      // Only include carInfo if user is a driver
      const userData = {
        userId: user.uid,
        nom: name,
        email,
        location,
        weeklyScheduleId: weeklyScheduleRef.id,
        activeTrips: [],
        matches: [],
        photo: "",
        role: role,
        preferences: preferencies,
        desti: desti,
      }

      if (role.toLowerCase() === "conductor") {
        userData.carInfo = carInfo
      }

      await addDoc(collection(db, "users"), userData)
      navigation.navigate("Login")
    } catch (error) {
      setErrorMsg("Error inesperat. Torna-ho a intentar.")
    }
  }

  const handleNextStep = () => {
    if (step === 4 && role.toLowerCase() === "passatger") {
      // Skip car info step (step 5) for passengers
      setStep(6);
    } else {
      setStep(step + 1);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ProgressBar progress={progress} color="#6A5ACD" style={styles.progressBar} />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.title}>
            {step === 1 && "El meu nom és"}
            {step === 2 && "El meu role és"}
            {step === 3 && "La meva ubicació és"}
            {step === 4 && "El meu destí és"}
            {step === 5 && "Informació del cotxe"}
            {step === 6 && "Horari de treball"}
            {step === 7 && "Especificar horari per dia"}
            {step === 8 && "Les meves preferències són"}
            {step === 9 && "Credencials"}
          </Text>

          {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

          {step === 1 && <TextInput style={styles.input} placeholder="Nom..." value={name} onChangeText={setName} />}

          {step === 2 && (
            <TextInput
              style={styles.input}
              placeholder="Conductor / Passatger..."
              value={role}
              onChangeText={setRole}
            />
          )}

          {step === 3 && (
            <TextInput style={styles.input} placeholder="Ubicació..." value={location} onChangeText={setLocation} />
          )}

          {step === 4 && (
            <TextInput style={styles.input} placeholder="Ubicació destí..." value={desti} onChangeText={setDesti} />
          )}

          {step === 5 && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Model del cotxe..."
                value={carInfo[0]}
                onChangeText={(text) => setCarInfo([text, carInfo[1], carInfo[2]])}
              />
              <TextInput
                style={styles.input}
                placeholder="Color del cotxe..."
                value={carInfo[1]}
                onChangeText={(text) => setCarInfo([carInfo[0], text, carInfo[2]])}
              />
              <TextInput
                style={styles.input}
                placeholder="Places disponibles..."
                value={carInfo[2]}
                onChangeText={(text) => setCarInfo([carInfo[0], carInfo[1], text])}
                keyboardType="numeric"
              />
            </>
          )}

          {step === 6 && (
            <View style={styles.stepContainer}>
              <TextInput
                style={styles.input}
                placeholder="Hora Entrada"
                value={horaEntrada}
                onChangeText={setHoraEntrada}
              />
              <TextInput
                style={styles.input}
                placeholder="Hora Sortida"
                value={horaSortida}
                onChangeText={setHoraSortida}
              />

              <View style={styles.step6ButtonContainer}>
                <TouchableOpacity style={[styles.button, styles.specifyButton]} onPress={goToDetailedSchedule}>
                  <Text style={styles.buttonText}>Seguir especificant</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.continueButton]} onPress={() => setStep(8)}>
                  <Text style={styles.buttonText}>Continuar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.skipButton]} onPress={() => setStep(7)}>
                  <Text style={styles.buttonText}>Saltar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {step === 7 && (
            <>
              {detailedSchedule.map((day, index) => (
                <View key={index} style={styles.dayContainer}>
                  <Text style={styles.dayTitle}>Dia {index + 1}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Hora Entrada"
                    value={day.entrada}
                    onChangeText={(text) => {
                      const updatedSchedule = [...detailedSchedule]
                      updatedSchedule[index] = {
                        ...updatedSchedule[index],
                        entrada: text,
                      }
                      setDetailedSchedule(updatedSchedule)
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Hora Sortida"
                    value={day.sortida}
                    onChangeText={(text) => {
                      const updatedSchedule = [...detailedSchedule]
                      updatedSchedule[index] = {
                        ...updatedSchedule[index],
                        sortida: text,
                      }
                      setDetailedSchedule(updatedSchedule)
                    }}
                  />
                </View>
              ))}
              <TouchableOpacity style={[styles.button, styles.continueButtonCenter]} onPress={() => setStep(8)}>
                <Text style={styles.buttonText}>Continuar</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 8 && (
            <View style={styles.selectorPreferences}>
              <SelectorPreferences preferencies={preferencies} setPreferencies={setPreferencies} />
            </View>
          )}

          {step === 9 && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Email..."
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Contrasenya..."
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </>
          )}
        </ScrollView>

        <View style={styles.buttonContainer}>
          {step > 1 && (
            <TouchableOpacity
              style={[styles.button, styles.backButton]}
              onPress={() => setStep(step - 1)}
            >
              <Text style={styles.buttonText}>Enrere</Text>
            </TouchableOpacity>
          )}

          {step < 9 && step !== 6 && step !== 7 ? (
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleNextStep}
            >
              <Text style={styles.buttonText}>Següent</Text>
            </TouchableOpacity>
          ) : step === 9 ? (
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSignUp}
            >
              <Text style={styles.buttonText}>Finalitzar</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  progressBar: {
    width: "100%",
    height: 5,
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  stepContainer: {
    width: "100%",
  },
  input: {
    width: "90%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    marginLeft: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 10,
  },
  button: {
    backgroundColor: "#333c87",
    paddingVertical: 15,
    borderRadius: 10,
    width: "40%",
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#808080",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  step6ButtonContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
    gap: 15,
  },
  specifyButton: {
    width: "80%",
  },
  continueButton: {
    width: "80%",
  },
  skipButton: {
    width: "80%",
    backgroundColor: "#b81414",
  },
  dayContainer: {
    marginBottom: 15,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 5,
  },
  continueButtonCenter: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
    width: "80%",
  },
})