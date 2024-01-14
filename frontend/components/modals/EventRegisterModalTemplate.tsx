import { View, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "expo-image";

interface IEventModalTemplateParams {
  children: any;
  parentSetter: (param) => void;
}

const EventRegisterModalTemplate = ({
  children,
  parentSetter,
}: IEventModalTemplateParams) => {
  return (
    <View>
      <View className=" h-14" />
      <TouchableOpacity
        onPress={() => parentSetter(false)}
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
