import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from "../components/ui/avatar";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ProfilePic from "./components/ProfilePic";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <ProfilePic />
      <Text style={styles.text}>Bem-vindo à Home!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  text: { fontSize: 20, fontWeight: "bold" },
});

export default HomeScreen;
