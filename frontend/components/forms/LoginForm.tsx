import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Button } from "react-native-elements";
import { Redirect } from "expo-router";

const LoginForm = (displayBackBtn) => {
  const [displayPassword, setDisplayPassword] = useState(true);

  const handleDisplayPassword = () => {
    if (displayPassword) {
      setDisplayPassword(false);
    } else {
      setDisplayPassword(true);
    }
  };

  const handleLoginSubmit = () => {};

  return (
    <View className="p-12 mt-8">
      <View className="flex items-center w-full mt-8">
        <Text className=" text-bright-blue text-4xl font-semibold ">
          Communivo
        </Text>
      </View>
      <View className=" mt-20 flex items-center">
        <View>
          <TextInput
            className="w-72 h-12 text-3xl"
            placeholder="Username"
          ></TextInput>
        </View>
        <View></View>
      </View>
    </View>
  );
};

export default LoginForm;
