import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import api from "../services/api";


const Register = ({ navigation }: { navigation: any }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [cpf, setCpf] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem");
            return;
        }
        try {
            const response = await api.post("/register", { name, email, password, cpf });
            Alert.alert("Sucesso", response.data.message);

            setName("");
            setCpf("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            
            navigation.navigate("Home");
        } catch (error: any) {
            Alert.alert("Erro", error.response?.data?.error || "Falha ao registrar");
        }
    };

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Cadastro</Text>

            <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="CPF" value={cpf} onChangeText={setCpf} />
            <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
            <TextInput style={styles.input} placeholder="Confirme a senha" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>
        </View>

    )
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f5f5f5" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    input: { width: "100%", padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, marginBottom: 10 },
    button: { backgroundColor: "#3498db", padding: 12, borderRadius: 5, width: "100%", alignItems: "center" },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    link: { marginTop: 10, color: "#3498db" }
  });

export default Register;