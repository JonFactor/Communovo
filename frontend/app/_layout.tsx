import { Stack } from "expo-router";
import { AuthContext, AuthProvider } from "../context/AuthContext";

const StackLayout = () => {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
};

export default StackLayout;
