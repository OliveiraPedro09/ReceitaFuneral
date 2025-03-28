import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, KeyboardAvoidingView, TouchableOpacity, Alert, StyleSheet, Platform, Modal, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TextInputMask } from "react-native-masked-text";
import api from "../services/api";
import { useAuth } from "../context/UserAuth";

const RevenueScreen = ({ navigation }: { navigation: any }) => {
    const { userId } = useAuth();
    const [value, setValue] = useState("");
    const [date, setDate] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newTagName, setNewTagName] = useState("");

    const fetchTags = async () => {
        try {
            const response = await api.get(`/tags/${userId}`);
            setTags(response.data.tags);
        } catch (error) {
            console.error("Erro ao buscar tags:", error);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handleCreateTag = async () => {
        if (!newTagName.trim()) {
            Alert.alert("Erro", "O nome da tag não pode estar vazio.");
            return;
        }

        try {
            const response = await api.post("/tags", { user_id: userId, name: newTagName });
            const newTag = response.data;
            setTags((prevTags) => [...prevTags, newTag]);
            setNewTagName("");
            setIsModalVisible(false);
            Alert.alert("Sucesso", "Tag criada com sucesso!");

            await fetchTags();
        } catch (error) {
            console.error("Erro ao criar tag:", error);
            Alert.alert("Erro", "Não foi possível criar a tag.");
        }
    };

    const handleRegisterRevenue = async () => {
        if (!userId) {
            Alert.alert("Erro", "Usuário não identificado. Faça login novamente.");
            return;
        }

        if (!value || !date || !selectedCategory) {
            Alert.alert("Erro", "Todos os campos são obrigatórios.");
            return;
        }

        const formattedValue = parseFloat(value.replace(/[^\d,]/g, "").replace(",", "."));
        if (isNaN(formattedValue) || formattedValue <= 0) {
            Alert.alert("Erro", "Informe um valor válido.");
            return;
        }

        const formattedTransactionDate = formatDateToISO(date);
        if (!formattedTransactionDate) {
            Alert.alert("Erro", "Preencha a data corretamente (dd/mm/yyyy).");
            return;
        }

        const payload = {
            user_id: userId,
            value: formattedValue,
            tag_id: selectedCategory,
            transaction_date: formattedTransactionDate,
        };

        try {
            const response = await api.post("/revenue", payload);
            Alert.alert("Sucesso", "Receita registrada com sucesso!");
            setValue("");
            setDate("");
            setSelectedCategory("");
            navigation.navigate("Home");
        } catch (error: any) {
            console.error("Erro ao registrar receita:", error.response?.data || error);
            Alert.alert("Erro", error.response?.data?.error || "Falha ao registrar receita.");
        }
    };

    const formatDateToISO = (date: string) => {
        if (!date || !date.includes("/")) return null;
        const [day, month, year] = date.split("/");
        if (!day || !month || !year) return null;
        return `${year}-${month}-${day}`;
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <View>
                    <Text style={styles.title}>Registrar Receita</Text>
                </View>

                <TextInputMask
                    type={'money'}
                    options={{
                        precision: 2,
                        separator: ',',
                        delimiter: '.',
                        unit: 'R$ ',
                        suffixUnit: ''
                    }}
                    style={styles.input}
                    placeholder="Valor (R$)"
                    value={value}
                    onChangeText={setValue}
                />

                <TextInputMask
                    type={'datetime'}
                    options={{
                        format: 'DD/MM/YYYY'
                    }}
                    style={styles.input}
                    placeholder="Data da Transação (dd/mm/yyyy)"
                    value={date}
                    onChangeText={setDate}
                />

                <View style={styles.selectContainer}>
                    <Picker
                        selectedValue={selectedCategory}
                        style={styles.picker}
                        onValueChange={(itemValue) => {
                            if (itemValue === "createTag") {
                                setIsModalVisible(true);
                            } else {
                                setSelectedCategory(itemValue);
                            }
                        }}
                    >
                        <Picker.Item label="Selecione uma tag..." value="" color="#aaa" />
                        {tags
                            .filter((tag) => tag.id && tag.name)
                            .map((tag) => (
                                <Picker.Item key={tag.id.toString()} label={tag.name} value={tag.id} />
                            ))}
                        <Picker.Item label="Criar nova tag..." value="createTag" color="#784A8A" />
                    </Picker>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleRegisterRevenue}>
                    <Text style={styles.buttonText}>Registrar Receita</Text>
                </TouchableOpacity>

                <Modal visible={isModalVisible} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Criar Nova Tag</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nome da Tag"
                                value={newTagName}
                                onChangeText={setNewTagName}
                            />
                            <TouchableOpacity style={styles.button} onPress={handleCreateTag}>
                                <Text style={styles.buttonText}>Criar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: "#ccc", marginTop: 10 }]}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text style={[styles.buttonText, { color: "#333" }]}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f5f5f5" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    input: { width: "100%", padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, marginBottom: 10 },
    selectContainer: { width: "100%", marginBottom: 10 },
    picker: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 20, backgroundColor: "#fff" },
    button: { backgroundColor: "#F39237", padding: 12, borderRadius: 15, width: "100%", alignItems: "center" },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },
});

export default RevenueScreen;