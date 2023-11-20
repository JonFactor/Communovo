import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import EventRegisterModalTemplate from "./EventRegisterModalTemplate";
import { ScrollView } from "react-native-gesture-handler";
import EventTypeList, { IEventType } from "../../constants/EventTypeList";
import router from "../../common/routerHook";

const EventTypeModal = ({ setter, parentSetter, parentValue }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const EventTypeClick = (value: IEventType) => {
    if (parentValue.includes(value.name)) {
      setSelectedItems(
        selectedItems.filter((item: string) => item === value.name)
      );
      parentSetter(parentValue.filter((item: string) => item === value.name));
    } else {
      setSelectedItems((list) => [...list, value.name]);
      parentSetter((list) => [...list, value.name]);
    }
  };

  useEffect(() => {
    setSelectedItems(parentValue);
  }, []);

  return (
    <EventRegisterModalTemplate setter={setter}>
      <ScrollView className=" p-4">
        <View className=" flex space-y-6 mt-10">
          {EventTypeList.map((value: IEventType, index: number) => {
            return (
              <View key={index} className="flex">
                <TouchableOpacity
                  onPress={() => EventTypeClick(value)}
                  className={` w-screen h-32 flex rounded-lg p-4 ${
                    selectedItems.includes(value.name)
                      ? "bg-md-blue"
                      : "bg-md-purple"
                  }`}
                >
                  <View>
                    <Text className=" text-3xl text-white font-semibold">
                      {value.name}
                    </Text>
                    <Text className=" text-white">{value.description}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </EventRegisterModalTemplate>
  );
};

export default EventTypeModal;
