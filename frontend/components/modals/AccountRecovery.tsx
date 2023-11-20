import { View, Text } from "react-native";
import React, { useState } from "react";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "expo-image";

const AccountRecovery = ({ parentSetter }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");

  const validateEntry = () => {
    return true;
  };
  return (
    <View>
      <View className=" mt-14 ml-6 flex-row">
        <TouchableOpacity
          className=" flex "
          onPress={() => parentSetter(false)}
        >
          <View className=" flex w-5 h-7">
            <Image
              contentFit="cover"
              className=" flex-1"
              source={require("../../assets/icons/backArrow.svg")}
            />
          </View>
        </TouchableOpacity>
        <Text className=" text-2xl ml-[14%]">Password Recovery</Text>
      </View>
      <View className=" flex w-full items-center mt-56">
        {errorMessage !== "" && (
          <Text className=" text-red-500 text-xl">{errorMessage}</Text>
        )}
        <View className=" w-[90%] flex flex-row">
          <View className=" flex w-14 h-10">
            <Image
              className=" flex-1 ml-2 mb-1"
              contentFit="cover"
              source={require("../../assets/icons/mail.svg")}
            />
          </View>
          <TextInput
            placeholder="Registered Email"
            className=" text-3xl w-[80%] flex ml-4"
          ></TextInput>
        </View>
        <View className=" w-[90%] flex h-1 mt-2 bg-md-blue" />
      </View>
    </View>
  );
};

export default AccountRecovery;
