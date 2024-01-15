import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import EventRegisterModalTemplate from "./EventRegisterModalTemplate";
import { ScrollView } from "react-native-gesture-handler";
import EventTypeList, { IEventType } from "../../constants/EventTypeList";

interface IEventTypeModalParams {
  setter: (params) => void;
  parentSetter: (params) => void;
  parentValue: any;
}

/*------------------------------------------------- EVENT TYPE MODAL -
  |
  |  Purpose:  
  |          Use the modal template to select which type this event falls under when
  |          creating a new event.
  |           
  |  Main Logic:  
  |          When a user selects a item if the item is in the array it is removed, if not
  |          add it to the parentSetter and change bg of the item. 
  |             
  *-------------------------------------------------------------------*/

const EventTypeModal = ({
  setter,
  parentSetter,
  parentValue,
}: IEventTypeModalParams) => {
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
    <EventRegisterModalTemplate parentSetter={setter}>
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
