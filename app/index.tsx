import React from "react";
import { AuthProvider, useAuth } from "./context/UserAuth";
import UnauthenticatedStack from "./navigation/NonAuthNav";
import AuthenticatedStack from "./navigation/AuthNav";

const RootNavigator = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <AuthenticatedStack /> : <UnauthenticatedStack />;
};

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}