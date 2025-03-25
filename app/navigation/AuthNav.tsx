import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import ExpenseScreen from "../screens/ExpenseScreen";
import RevenueScreen from "../screens/RevenueScreen";

const Stack = createStackNavigator();

const AuthenticatedStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Expense" component={ExpenseScreen} options={{ headerShown: true, title: '' }} />
    <Stack.Screen name="Revenue" component={RevenueScreen} options={{ headerShown: true, title: ''}} />
  </Stack.Navigator>
);

export default AuthenticatedStack;