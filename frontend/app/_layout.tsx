import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";

// sets the folder name for all the pages along with passing any contexts / parent elements to
// all of the pages and hide the headers.
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
