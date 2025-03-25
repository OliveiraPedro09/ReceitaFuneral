import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";
import api from "../services/api";
import { useAuth } from "../context/UserAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await api.post("/login", { email, password });
      const { token, userId } = response.data;
      await AsyncStorage.setItem("token", token); 
      login(userId);
      Alert.alert("Login realizado com sucesso!");
    } catch (error: any) {
      Alert.alert("Erro", error.response?.data?.error || "Falha ao realizar login.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>Seja Bem-Vindo !</Text>
        <Text style={styles.subtitle}>Faça seu login</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Criar uma conta</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 36, fontWeight: "bold", marginBottom: 20 },
  subtitle:{ fontSize: 24, fontWeight: "600", marginBottom: 20 },
  input: { width: "100%", padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginBottom: 10 },
  button: { backgroundColor: "#784A8A", padding: 12, borderRadius: 20, width: "50%", alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  link: { marginTop: 10, color: "#0D0A0B", textDecorationLine: "underline" }
});

export default LoginScreen;