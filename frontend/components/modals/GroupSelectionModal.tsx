import { View, Text } from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import EventRegisterModalTemplate from "./EventRegisterModalTemplate";
import { TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { GetGroupArrayViaUserApi } from "../../functions/Groups";
import GroupCard from "../cards/GroupCard";

interface IGroupSelectionModalParams {
  setter: (params) => void;
  parentSetter: (params) => void;
  parentValue: any;
}

/*------------------------------------------------- GROUP SELECT MODAL -
  |
  |  Purpose:  
  |          use the template to select which group this event belongs to, if any.
  |
  |  Main Logic:  
  |          When a user selects a item if the item is in the array it is removed, if not
  |          add it to the parentSetter and change bg of the item. 
  |             
  |           
  |           
  *-------------------------------------------------------------------*/

const GroupSelectionModal = ({
  setter,
  parentSetter,
  parentValue,
}: IGroupSelectionModalParams) => {
  const [selectedItems, setSelectedItems] = useState(null);
  const [userGroups, setUserGroups] = useState([]);

  const GroupSelection = (value, index) => {
    if (selectedItems === index) {
      parentSetter(null);
      setSelectedItems(null);
      return;
    }
    parentSetter(value);
    setSelectedItems(index);
  };

  useEffect(() => {
    const loadGroups = async () => {
      const groups = await GetGroupArrayViaUserApi();

      setUserGroups(groups);
    };

    loadGroups();
    setSelectedItems(parentValue);
  }, []);

  return (
    <EventRegisterModalTemplate parentSetter={setter}>
      <ScrollView className=" px-4">
        <View className=" w-full items-center flex">
          <Text className="text-5xl">Group</Text>
        </View>
        <View className=" mt-4">
          {userGroups !== null && (
            <View className=" w-full items-center">
              {userGroups.map((value, index: number) => {
                return (
                  <TouchableOpacity
                    key={index}
                    className=" mt-4 flex items-center"
                    onPress={() => GroupSelection(value.title, index)}
                  >
                    {selectedItems === index && (
                      <Text className=" text-2xl font-semibold text-green-500">
                        Selected
                      </Text>
                    )}
                    <GroupCard item={value} routingIgnore={"True"} />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </EventRegisterModalTemplate>
  );
};

export default GroupSelectionModal;
