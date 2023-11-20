import { View, Text, TouchableOpacity } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { Image } from "expo-image";

const EventRegisterModalTemplate = ({ children, setter }) => {
  return (
    <View>
      <View className=" h-14" />
      <TouchableOpacity
        onPress={() => setter(false)}
        className=" flex w-6 h-8 ml-4"
      >
        <Image
          className=" flex-1"
          contentFit="cover"
          source={require("../../assets/icons/backArrow.svg")}
        />
      </TouchableOpacity>
      {children}
    </View>
  );
};

export default EventRegisterModalTemplate;
