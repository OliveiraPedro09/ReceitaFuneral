import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import LottieView from 'lottie-react-native';

const Welcome: React.FC<{ navigation: any }> = ({ navigation }) => {
  const backgroundColor = useRef(new Animated.Value(0)).current; 
  const textOpacity = useRef(new Animated.Value(0)).current; 
  const textPosition = useRef(new Animated.Value(-50)).current; 
  const indexRef = useRef(0); 

  useEffect(() => {
    const colors = ['#F39237']; 
  
    const animateColor = () => {
      Animated.timing(backgroundColor, {
        toValue: indexRef.current,
        duration: 3000,
        useNativeDriver: false,
      }).start(() => {
        indexRef.current = (indexRef.current + 1) % colors.length;
        animateColor(); 
      });
    };

    const animateText = () => {
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(textPosition, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          navigation.navigate('Login', { screen: 'Login' });
        }, 2500); 
      });
    };

    animateColor(); 
    animateText(); 
  }, [backgroundColor, textOpacity, textPosition, navigation]);

  const interpolatedColor = backgroundColor.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['#F39237', '#F39237', '#F39237'],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: interpolatedColor }]}>
      <LottieView
        source={require('../../assets/welcome-animation.json')}
        autoPlay
        loop
        style={styles.animation}
      />

      <Animated.Text
        style={[
          styles.title,
          {
            opacity: textOpacity,
            transform: [{ translateY: textPosition }], 
          },
        ]}
      >
        Receita Funeral
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
  },
});

export default Welcome;