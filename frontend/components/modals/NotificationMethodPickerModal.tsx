import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import ExitPage from "../common/ExitPage";
import useSWR from "swr";
import { Image } from "expo-image";

const NotificationMethodPickerModal = ({
  parrentSetter,
  notificationMethodsSetter,
}) => {
  const methods = ["Text", "Email"]; //"Calender Event"];
  const [selectedMethods, setSelectedMethods] = useState([]);

  useEffect(() => {
    notificationMethodsSetter(selectedMethods);
  }, [selectedMethods]);
  return (
    <ScrollView className=" mt-10">
      <View className=" ml-6 mt-2">
        <ExitPage modalSetter={parrentSetter} />
      </View>
      <View className=" w-full flex items-center mt-6">
        <Text className=" text-2xl">Select Method Of Notification</Text>
      </View>

      <View className=" w-full items-center flex mt-6">
        {methods.map((name, index) => {
          return (
            <View className=" w-full items-center flex mt-4" key={index}>
              {selectedMethods.includes(name) && (
                <Text className=" text-green-400 text-xl font-semibold">
                  Selected
                </Text>
              )}
              <TouchableOpacity
                className=" w-3/4 bg-md-blue py-2 rounded-xl"
                onPress={() => {
                  if (selectedMethods.includes(name)) {
                    setSelectedMethods(
                      selectedMethods.filter((a) => {
                        a !== name;
                      })
                    );
                  } else {
                    setSelectedMethods((list) => [...list, name]);
                  }
                }}
              >
                <Text className=" text-center text-3xl">{name}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
        <TouchableOpacity
          className=" flex-1 w-60 aspect-square mt-24 "
          onPress={() => {
            parrentSetter(false);
          }}
        >
          <Image
            contentFit="cover"
            className=" flex-1 w-full h-full"
            source={require("../../assets/icons/bell.svg")}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default NotificationMethodPickerModal;
