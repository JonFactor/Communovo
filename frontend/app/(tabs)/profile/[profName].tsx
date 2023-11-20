import { View, Text } from "react-native";
import React from "react";
import { Stack, useGlobalSearchParams, useSearchParams } from "expo-router";

const OtherProfile = () => {
  const { profName } = useGlobalSearchParams();
  return (
    <View>
      <Stack.Screen options={{ headerShown: false }} />
      <Text>{profName}</Text>
    </View>
  );
};

export default OtherProfile;
