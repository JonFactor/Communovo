import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Linker } from "../../utils/Linker";

const ExitPage = ({ redirectLink = "", modalSetter = (param) => {} }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (redirectLink !== "") {
          Linker(redirectLink);
        } else {
          modalSetter(false);
        }
      }}
    >
      <Text className=" text-2xl text-red-400">Exit</Text>
    </TouchableOpacity>
  );
};

export default ExitPage;
