import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Linker } from "../../utils/Linker";

const ExitPage = ({
  redirectLink = "",
  modalSetter = (param) => {},
  largeText,
}) => {
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
      {largeText ? (
        <Text className=" text-3xl text-red-400">Exit</Text>
      ) : (
        <Text className=" text-2xl text-red-400">Exit</Text>
      )}
    </TouchableOpacity>
  );
};

export default ExitPage;
