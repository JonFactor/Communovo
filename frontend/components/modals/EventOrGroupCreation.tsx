import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import router from "../../common/routerHook";
import { Linker } from "../../utils/Linker";

const EventOrGroupCreation = ({ thisDisplaySetter }) => {
  const handleEventClick = () => {
    const redirected = Linker("/events");
    if (!redirected) {
      thisDisplaySetter(true);
      return;
    }
    thisDisplaySetter(false);
  };

  const handleGroupClick = () => {
    const redirected = Linker("/createGroup");
    if (!redirected) {
      thisDisplaySetter(true);
      return;
    }
    thisDisplaySetter(false);
  };

  return (
    <View className=" w-full flex items-center mt-16">
      <View className=" w-72 flex items-center flex-col space-y-12 mt-12">
        <TouchableOpacity
          className=" w-64 h-72 bg-md-blue p-12 rounded-3xl"
          onPress={handleGroupClick}
        >
          <View className=" flex w-full items-center space-y-8">
            <Text className=" text-3xl font-semibold justify-center text-center">
              Start a new Group!
            </Text>
            <Text className=" text-5xl">🥳</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className=" w-64 h-72  bg-md-purple p-4 rounded-3xl"
          onPress={handleEventClick}
        >
          <View className=" flex w-full items-center space-y-8 mt-12">
            <Text className=" text-3xl font-semibold text-center justify-center">
              Start a new Event!
            </Text>
            <Text className=" text-4xl">🥳🥳🥳</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className=" w-64 h-24 rounded-2xl bg-red-200 items-center"
          onPress={() => thisDisplaySetter(false)}
        >
          <Text className=" mt-7 font-semibold text-3xl">Give up {":("}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EventOrGroupCreation;
