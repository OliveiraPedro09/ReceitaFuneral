import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ProfilePic from "../components/ProfilePic";
import { Button, Card, Divider } from "react-native-paper";


const HomeScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <View className="bg-secondary-50 p-4 rounded-lg flex-row-reverse items-center justify-between shadow">
        <ProfilePic />
      </View>
      <Divider />
      <Card style={{ marginTop: 10 }}>
        <Card.Title title="Bem-vindo à Home!" />
        <Card.Content>
          <Text style={{ fontSize: 16 }}>Saldo Atual:</Text>
          <Card.Actions style={{ justifyContent: "center" }}>
            <Button onPress={() => navigation.navigate("Revenue")}>Adicionar Receita</Button>
            <Button onPress={() => navigation.navigate("Expense")}>Adicionar Despesa</Button>
          </Card.Actions>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  text: { fontSize: 20, fontWeight: "bold" },
});

export default HomeScreen;
