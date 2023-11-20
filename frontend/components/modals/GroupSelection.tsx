import { View, Text } from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import EventRegisterModalTemplate from "./EventRegisterModalTemplate";
import { TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import EventTypeList, { IEventType } from "../../constants/EventTypeList";
import router from "../../common/routerHook";

const GroupSelectionModal = ({ setter, parentSetter, parentValue }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const GroupSelection = (value) => {};
  return (
    <EventRegisterModalTemplate setter={setter}>
      <ScrollView className=" p-4">
        <View className=" flex space-y-6 mt-10">
          {EventTypeList.map((value: IEventType, index: number) => {
            return (
              <View key={index} className="flex">
                <TouchableOpacity
                  onPress={() => GroupSelection(value)}
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

export default GroupSelectionModal;
