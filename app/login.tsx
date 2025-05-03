import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username && password) {
      router.push("/dashboard");
    } else {
      alert("Please enter your username and password.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headingTop}>WELCOME</Text>
      <Text style={styles.subText}>TO</Text>
      <Text style={styles.headingApp}>CHECKLIST MANAGEMENT SYSTEM</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
  },
  headingTop: {
    fontSize: 38,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 4,
  },
  subText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
  headingApp: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 40,
    color: "#2b4c8a",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
    elevation: 1,
  },
  button: {
    backgroundColor: "#2b4c8a",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
