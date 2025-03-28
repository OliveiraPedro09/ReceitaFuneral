import React from "react";
import { Avatar, Card, IconButton } from 'react-native-paper';
import { StyleSheet, View } from "react-native";

interface ProfilePicProps {
  name: string;
  avatar: string;
}

const ProfilePic = ({ name, avatar }: ProfilePicProps) => {
    return (
      <Card style={styles.card}>
        <View style={styles.container}>
          <Avatar.Image size={80} source={{ uri: avatar }} />
          <View style={styles.textContainer}>
            <Card.Title
              title={name}
              subtitle="Conta Corrente"
              titleStyle={styles.title}
              subtitleStyle={styles.subtitle}
            />
          </View>
          <IconButton icon="dots-vertical" onPress={() => {}} />
        </View>
      </Card>
    );
};

const styles = StyleSheet.create({
  card: {
    height: 120,
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});

export default ProfilePic;