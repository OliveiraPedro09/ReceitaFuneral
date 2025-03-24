import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ProfilePic from "../components/ProfilePic";
import { Card, Divider } from "react-native-paper";


const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View className="bg-secondary-50 p-4 rounded-lg flex-row-reverse items-center justify-between shadow">
        <ProfilePic />
      </View>
      <Divider />
      <Card style={{ margin: 10 }}>
        <Card.Title title="Bem-vindo à Home!" />
        <Card.Content>
        
        <View>
          <Text>Colocar os components aqui</Text>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  text: { fontSize: 20, fontWeight: "bold" },
});

export default HomeScreen;
