import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Linker } from "../../utils/Linker";

interface IExitPageParams {
  redirectLink?: string;
  modalSetter?: (param) => void;
  largeText?: boolean;
}

// make a standardized function for all page exiting, giving each page the control it needs
// on the logic side while leaving the ui universal, besides the largeText boolean
const ExitPage = ({
  redirectLink = "",
  modalSetter = (param) => {},
  largeText = false,
}: IExitPageParams) => {
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
