import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { TextInputMask } from 'react-native-masked-text';
import api from "../services/api";
import { useAuth } from '../context/UserAuth';

const ExpenseScreen = () => {
    const categories = [
        { label: "Alimentação", value: "food" },
        { label: "Transporte", value: "transport" },
        { label: "Saúde", value: "health" },
        { label: "Educação", value: "education" },
        { label: "Lazer", value: "leisure" },
    ];

    const { userId } = useAuth();
    const [value, setValue] = useState("");
    const [date, setDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [billingDate, setBillingDate] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [balance, setBalance] = useState(0);

    const handleRegisterExpense = async () => {
        if (!userId) {
            Alert.alert("Erro", "Usuário não identificado. Faça login novamente.");
            return;
        }

        if (!value || !date || !dueDate || !billingDate || !selectedCategory) {
            Alert.alert("Erro", "Todos os campos são obrigatórios.");
            return;
        }

        const formattedValue = parseFloat(value.replace(/[^\d,]/g, "").replace(",", ".")); // Converte para número
        if (isNaN(formattedValue) || formattedValue <= 0) {
            Alert.alert("Erro", "Informe um valor válido.");
            return;
        }

        const formattedTransactionDate = formatDateToISO(date);
        const formattedBillingDate = formatDateToISO(billingDate);
        const formattedDueDate = formatDateToISO(dueDate);

        if (!formattedTransactionDate || !formattedBillingDate || !formattedDueDate) {
            Alert.alert("Erro", "Preencha todas as datas corretamente (dd/mm/yyyy).");
            return;
        }

        const payload = {
            user_id: userId,
            value: formattedValue,
            tag: selectedCategory,
            transaction_date: formattedTransactionDate,
            billing_date: formattedBillingDate,
            due_date: formattedDueDate,
        };

        try {
            const response = await api.post("/expense", payload);
            setBalance(response.data.newBalance); // Atualiza o saldo com o valor retornado pela API
            Alert.alert("Sucesso", "Despesa registrada com sucesso!");
        } catch (error: any) {
            console.error("Erro ao registrar:", error.response?.data || error);
            Alert.alert("Erro", error.response?.data?.error || "Falha ao registrar despesa.");
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
                    <Text style={styles.title}>Registrar Despesa</Text>
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

                <TextInputMask
                    type={'datetime'}
                    options={{
                        format: 'DD/MM/YYYY'
                    }}
                    style={styles.input}
                    placeholder="Data de Vencimento (dd/mm/yyyy)"
                    value={dueDate}
                    onChangeText={setDueDate}
                />

                <TextInputMask
                    type={'datetime'}
                    options={{
                        format: 'DD/MM/YYYY'
                    }}
                    style={styles.input}
                    placeholder="Data de Faturamento (dd/mm/yyyy)"
                    value={billingDate}
                    onChangeText={setBillingDate}
                />

                <View style={styles.selectContainer}>
                    <Picker
                        selectedValue={selectedCategory}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                    >
                        <Picker.Item label="Selecione uma categoria..." value="" color="#aaa" />
                        {categories.map((category) => (
                            <Picker.Item key={category.value} label={category.label} value={category.value} />
                        ))}
                    </Picker>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleRegisterExpense}>
                    <Text style={styles.buttonText}>Registrar Despesa</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f5f5f5" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    balance: { fontSize: 18, fontWeight: "bold", marginBottom: 20, color: "#2ecc71" },
    input: { width: "100%", padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, marginBottom: 10 },
    selectContainer: { width: "100%", marginBottom: 10 },
    picker: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 5, backgroundColor: "#fff" },
    button: { backgroundColor: "#3498db", padding: 12, borderRadius: 5, width: "100%", alignItems: "center" },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default ExpenseScreen;