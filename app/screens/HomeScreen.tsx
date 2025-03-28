import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from "react-native";
import ProfilePic from "../components/ProfilePic";
import { Card, Divider } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import api from "../services/api";
import { useAuth } from "../context/UserAuth";
import { Button } from "react-native-paper";


const HomeScreen = ({ navigation }: { navigation: any }) => {
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);
    const [balance, setBalance] = useState<number | null>(null);
    interface Transaction {
        id: number;
        type: string;
        tag_name: string;
        value: number;
        transaction_date: string;
    }

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    interface Expense {
        id: number;
        tag: string;
        value: number;
        transaction_date: string;
    }

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const transactionsPerPage = 5;
    const [currentTransactionPage, setCurrentTransactionPage] = useState(1);
    const { userId } = useAuth();
    const [user, setUser] = useState({
        name: "",
        avatar: "assets/images/ronaldo.jpg",
    });

    const fetchUserProfile = async () => {
        try {
            const response = await api.get(`/profile/${userId}`);
            setUser(response.data);
        } catch (error) {
            console.error("Erro ao buscar perfil do usuário:", error);
        }
    };

    const fetchBalance = async () => {
        try {
            const response = await api.get(`/balance/${userId}`);
            setBalance(response.data.balance);
        } catch (error) {
            console.error("Erro ao buscar saldo:", error);
        }
    };

    const fetchExpenses = async () => {
        try {
            const response = await api.get(`/expenses/${userId}`);
            setExpenses(response.data.expenses);
        } catch (error) {
            console.error("Erro ao buscar despesas:", error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await api.get(`/transactions/${userId}`);
            setTransactions(response.data.transactions);
        } catch (error) {
            console.error("Erro ao buscar transações:", error);
        }
    };

    useEffect(() => {
        fetchBalance();
        fetchTransactions();
        fetchUserProfile();
    }, []);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentExpenses = expenses.slice(startIndex, endIndex);

    const handleNextPage = () => {
        if (currentPage * itemsPerPage < expenses.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const transactionStartIndex = (currentTransactionPage - 1) * transactionsPerPage;
    const transactionEndIndex = transactionStartIndex + transactionsPerPage;
    const currentTransactions = transactions.slice(transactionStartIndex, transactionEndIndex);

    const handleNextTransactionPage = () => {
        if (currentTransactionPage * transactionsPerPage < transactions.length) {
            setCurrentTransactionPage(currentTransactionPage + 1);
        }
    };

    const handlePreviousTransactionPage = () => {
        if (currentTransactionPage > 1) {
            setCurrentTransactionPage(currentTransactionPage - 1);
        }
    };

    return (
        <View style={styles.container}>
            <View>
                <Divider />
                <ProfilePic name={user.name} avatar={user.avatar} />
            </View>
            <Divider />
            <Card style={{ marginTop: 10, backgroundColor: "#fff" }}>
                <Card.Content>
                    <View style={styles.balanceContainer}>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Saldo Atual</Text>
                        <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
                            <Icon
                                name={isBalanceVisible ? "eye" : "eye-off"}
                                size={24}
                                color="#333"
                                style={{ marginLeft: 10 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.balance}>
                        {isBalanceVisible
                            ? balance !== null
                                ? `R$ ${balance.toFixed(2)}`
                                : "Carregando..."
                            : "****"}
                    </Text>
                </Card.Content>
            </Card>
            {/* <Card style={{ marginTop: 10, backgroundColor: "#fff" }}>
                <Card.Content>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionHeaderText}>Últimas Despesas</Text>
                    </View>
                    <FlatList
                        data={currentExpenses}
                        keyExtractor={(item) => item.id.toString()}
                        ListHeaderComponent={
                          <View style={styles.tableHeader}>
                              <Text style={styles.headerText}>Categoria</Text>
                              <Text style={styles.headerText}>Valor</Text>
                              <Text style={styles.headerText}>Data</Text>
                          </View>
                      }
                        renderItem={({ item }) => (
                            <View style={styles.expenseItem}>
                                <Text style={styles.expenseText}>{item.tag}</Text>
                                <Text style={styles.expenseText}>R$ {item.value.toFixed(2)}</Text>
                                <Text style={styles.expenseText}>{item.transaction_date}</Text>
                            </View>
                        )}
                        ListEmptyComponent={
                          <Text style={styles.emptyMessage}>Nenhuma despesa encontrada.</Text>
                        }
                    />
                    <View style={styles.pagination}>
                      <Button
                          mode="outlined"
                          onPress={handlePreviousPage}
                          disabled={currentPage === 1}
                          style={styles.paginationButton}
                      >
                          Anterior
                      </Button>

                      <Text style={styles.paginationText}>Página {currentPage}</Text>

                      <Button
                          mode="outlined"
                          onPress={handleNextPage}
                          disabled={currentPage * itemsPerPage >= expenses.length}
                          style={styles.paginationButton}
                      >
                          Próxima
                      </Button>
                    </View>
                </Card.Content>    
            </Card> */}
            <View style={{ marginVertical: 10 }}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Revenue")}>
                    <Text style={styles.buttonText}>Adicionar Receitas</Text>
                </TouchableOpacity>
                <Divider style={{ marginVertical: 5 }} />
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Expense")}>
                    <Text style={styles.buttonText}>Adicionar Despesas</Text>
                </TouchableOpacity>
            </View>
            <Card style={{ marginTop: 10, backgroundColor: "#fff" }}>
                <Card.Content>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>Últimas Transações</Text>
                    </View>
                    <FlatList
                        data={currentTransactions}
                        keyExtractor={(item) => item.id.toString()}
                        ListHeaderComponent={
                            <View style={styles.tableHeader}>
                                <Text style={styles.headerText}>Tipo</Text>
                                <Text style={styles.headerText}>Categoria</Text>
                                <Text style={styles.headerText}>Valor</Text>
                                <Text style={styles.headerText}>Data</Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <View style={styles.expenseItem}>
                                <Text style={styles.expenseText}>{item.type === "expense" ? "Despesa" : "Receita"}</Text>
                                <Text style={styles.expenseText}>{item.tag_name}</Text>
                                <Text style={styles.expenseText}>R$ {item.value.toFixed(2)}</Text>
                                <Text style={styles.expenseText}>{item.transaction_date}</Text>
                            </View>
                        )}
                        ListEmptyComponent={
                            <Text style={styles.emptyMessage}>Nenhuma transação encontrada.</Text>
                        }
                    />
                    <View style={styles.pagination}>
                        <Button
                            mode="outlined"
                            onPress={handlePreviousTransactionPage}
                            disabled={currentTransactionPage === 1}
                            style={styles.paginationButton}
                            textColor={currentTransactionPage === 1 ? "#aaa" : "#F39237"}
                        >
                            Anterior
                        </Button>

                        <Text style={styles.paginationText}>Página {currentTransactionPage}</Text>

                        <Button
                            mode="outlined"
                            onPress={handleNextTransactionPage}
                            disabled={currentTransactionPage * transactionsPerPage >= transactions.length}
                            style={styles.paginationButton}
                            textColor={currentTransactionPage === 1 ? "#F39237" : "#aaa" }
                        >
                            Próxima
                        </Button>
                    </View>
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20,
    },
    balanceContainer: { flexDirection: "row", alignItems: "center", marginTop: 10, justifyContent: "space-between" },
    balance: { fontSize: 24, fontWeight: "bold", marginTop: 5, color: "#2ecc71" },
    expenseItem: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, paddingHorizontal: 10, backgroundColor: "#f9f9f9", borderBottomWidth: 1, borderBottomColor: "#ddd", },
    expenseText: { fontSize: 14, color: "#333", textAlign: "center", flex: 1 },
    pagination: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
    emptyMessage: { textAlign: "center", fontSize: 16, color: "#aaa", marginTop: 20 },
    tableHeader: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#F39237", paddingVertical: 10, paddingHorizontal: 10, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomColor: "#ccc" },
    headerText: { fontSize: 16, fontWeight: "bold", color: "#fff", textAlign: "center", flex: 1 },  
    button: { backgroundColor: "#F39237", padding: 12, borderRadius: 20, width: "100%", alignItems: "center" },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    paginationButton: { borderColor: "#F39237", borderWidth: 1, borderRadius: 20, marginHorizontal: 5},
    paginationText: { fontSize: 16, fontWeight: "bold", color: "#333", marginHorizontal: 10 },
    sectionHeader: { backgroundColor: "#fff", borderWidth: 2, borderColor: "#F39237", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10, marginBottom: 10, alignItems: "center" },
    sectionHeaderText: { fontSize: 20, fontWeight: "bold", color: "#F39237", textAlign: "center" },
});

export default HomeScreen;
