import React from "react";
import { View } from "react-native";
import { Avatar, Card, IconButton } from 'react-native-paper';


const ProfilePic = () => {
    return (
      <Card>
        <Card.Title
        title="Bem-Vindo"
        subtitle="Ronaldo Fenômeno"
        left={(props) => <Avatar.Image {...props} source={require('assets/images/ronaldo.jpg')} />}
        right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
      />
      </Card>
    );
}

export default ProfilePic;